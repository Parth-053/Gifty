// client/src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  sendEmailVerification 
} from "firebase/auth";
import { auth } from '../config/firebase';
import api from '../api/axios';

// 1. Sync User (Fetches Profile & Checks Session)
export const syncUser = createAsyncThunk(
  "auth/syncUser",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) return rejectWithValue("No user logged in");

      // Get fresh Firebase token
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem("token", token);

      // Fetch user from DB
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
      
      // Sync with backend & fetch profile
      const result = await dispatch(syncUser()).unwrap();
      return result;
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password';
      return rejectWithValue(errorMessage);
    }
  }
);

// 3. Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phone }, { dispatch, rejectWithValue }) => {
    try {
      // Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);

      // Get token to securely sync with backend
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      // Sync with backend to create MongoDB User record
      await api.post('/auth/sync/user', 
        { fullName, phone }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Return the synced user so they stay logged in for the verify-email page
      return await dispatch(syncUser()).unwrap();
    } catch (error) {
      // Rollback Firebase user if backend sync fails
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
      await api.post('/auth/logout'); // Optional backend invalidation
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
  loading: true, // Start true to check session on initial load
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
      // Sync User Profile
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
      
      // Login User
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, () => { /* State managed by syncUser */ }) 
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
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
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;