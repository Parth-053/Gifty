// client/src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile
} from "firebase/auth";
import { auth } from '../config/firebase';
import api from '../api/axios';

// 1. Sync User (Fetches Profile & Checks Session)
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
      const result = await dispatch(syncUser()).unwrap();
      return result;
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password';
      return rejectWithValue(errorMessage);
    }
  }
);

// 3. Register User (Now handles Address internally & assumes OTP is already verified)
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phone, addressData }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Set Display Name
      await updateProfile(user, { displayName: fullName });

      // 3. Get token to securely sync with backend
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      // 4. Sync with backend to create MongoDB User record AND Address
      await api.post('/auth/sync/user', 
        { fullName, phone, addressData }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 5. Fetch and return full user profile
      return await dispatch(syncUser()).unwrap();
    } catch (error) {
      if (auth.currentUser) {
        try { await auth.currentUser.delete(); } catch (e) { console.warn("Rollback failed:", e); }
      }
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered';
      return rejectWithValue(error.response?.data?.message || errorMessage);
    }
  }
);

// 4. Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      await api.post('/auth/logout'); 
      return true;
    } catch (error) {
      console.error("Logout error:", error); 
      return rejectWithValue("Logout failed");
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
      .addCase(syncUser.pending, (state) => { state.error = null; })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        if (action.payload !== "No user logged in") {
          state.error = action.payload;
        }
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, () => {  }) 
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;