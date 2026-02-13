import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile
} from "firebase/auth";
import { auth } from '../config/firebase';
import api from '../api/axios';

// 1. Sync User
export const syncUser = createAsyncThunk(
  "auth/syncUser",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) return rejectWithValue("No user logged in");
      
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem("token", token);
      
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue("Profile not found");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// 2. Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return await dispatch(syncUser()).unwrap();
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password';
      return rejectWithValue(errorMessage);
    }
  }
);

// 3. Register User (FIXED)
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
      // The backend creates the user and RETURNS the new user object in 'response.data.data'
      const response = await api.post('/auth/sync/user', 
        { fullName, phone, addressData }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // FIX: Return the data directly. Do NOT call syncUser() here.
      // This prevents the "404 Not Found" race condition.
      return response.data.data; 

    } catch (error) {
      // Cleanup if failed
      if (auth.currentUser) {
        try { await auth.currentUser.delete(); } catch (e) { console.warn("Rollback failed:", e); }
      }
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      
      return rejectWithValue(errorMessage);
    }
  }
);

// 4. Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await api.post('/auth/logout'); 
        } catch { /* Ignore backend errors */ }
      }
      await signOut(auth);
      localStorage.removeItem("token");
      return true;
    } catch {
      return true; 
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, 
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sync
      .addCase(syncUser.pending, (state) => { state.error = null; })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        if (action.payload && action.payload !== "No user logged in") {
           state.error = action.payload;
        }
      })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state) => { state.loading = false; })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register (UPDATED STATE UPDATE)
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.isAuthenticated = true; // Mark as logged in immediately
        state.user = action.payload;  // Use the returned data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;