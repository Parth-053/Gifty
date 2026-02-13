import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile
} from "firebase/auth";
import { auth } from '../config/firebase';
import api from '../api/axios';

// --- 1. Send OTP Action ---
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send code");
    }
  }
);

// --- 2. Verify OTP Action ---
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid code");
    }
  }
);

// --- 3. Register User (Creates Account) ---
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phone, addressData }, { rejectWithValue }) => {
    try {
      // A. Create in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      
      // B. Get Token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      
      // C. Sync with MongoDB
      const response = await api.post('/auth/sync/user', 
        { fullName, phone, addressData }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.data; 

    } catch (error) {
      // Cleanup: Delete Firebase user if MongoDB sync fails
      if (auth.currentUser) {
        try { await auth.currentUser.delete(); } catch (e) { console.error(e); }
      }
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already registered';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      
      return rejectWithValue(errorMessage);
    }
  }
);

// --- 4. Login User ---
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return await dispatch(syncUser()).unwrap();
    } catch (error) {
      // Fix: error was defined but unused if we just return a string
      console.error("Login failed:", error); 
      return rejectWithValue("Invalid email or password");
    }
  }
);

// --- 5. Sync User ---
export const syncUser = createAsyncThunk(
  "auth/syncUser",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) return rejectWithValue("No user");
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem("token", token);
      
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sync failed");
    }
  }
);

// --- 6. Logout ---
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    // Fix: Added comment to empty catch block
    try { await api.post('/auth/logout'); } catch { /* ignore backend errors on logout */ }
    await signOut(auth);
    localStorage.removeItem("token");
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Handle OTP Loading States
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Handle Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.isAuthenticated = true; 
        state.user = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Handle Login
      .addCase(loginUser.fulfilled, (state) => { state.loading = false; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Handle Sync
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(syncUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Handle Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;