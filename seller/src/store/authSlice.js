import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import api from "../api/axios";

// --- Async Thunks ---

// 1. Sync Seller Profile (Fetch from MongoDB)
// We use 'syncSeller' as the action name
export const syncSeller = createAsyncThunk(
  "auth/syncSeller",
  async (_, { rejectWithValue }) => {
    try {
      // Ensure Firebase user exists
      if (!auth.currentUser) return rejectWithValue("No user logged in");

      // Get Token & Sync to LocalStorage
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem("token", token);
      
      // Fetch Profile
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue({ status: 404, message: "Profile not found" });
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to fetch profile"
      });
    }
  }
);

// 2. Login
export const loginSeller = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const result = await dispatch(syncSeller()).unwrap();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Register
export const registerSeller = createAsyncThunk(
  "auth/register",
  async (registrationData, { dispatch, rejectWithValue }) => {
    try {
      const { email, password, otp, ...details } = registrationData;

      await signOut(auth);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      await api.post("/auth/register-seller", 
        { email, otp, ...details }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await dispatch(syncSeller()).unwrap();
      return result;

    } catch (error) {
      if (auth.currentUser) {
        try { await auth.currentUser.delete(); } catch (e) { console.warn("Rollback failed:", e); }
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 4. Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  localStorage.clear();
});

const initialState = {
  seller: null,
  isAuthenticated: false,
  loading: true, 
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    // FIX: Renamed to clearError to match your hooks/components
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Sync
      .addCase(syncSeller.pending, (state) => { state.error = null; })
      .addCase(syncSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(syncSeller.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 404) {
             state.isAuthenticated = true; 
             state.seller = null; 
        } else {
             state.isAuthenticated = false;
             state.seller = null;
             state.error = action.payload?.message;
        }
      })
      // Login
      .addCase(loginSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerSeller.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.seller = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

// EXPORTS
export const { setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;