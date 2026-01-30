import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export const syncSellerProfile = createAsyncThunk(
  "auth/syncSellerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data; 
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Failed to load seller profile";
      return rejectWithValue({ status, message });
    }
  }
);

export const logoutSeller = createAsyncThunk("auth/logoutSeller", async () => {
    await signOut(auth);
    return true;
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
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // FIX 1: Do NOT set global loading to true here. 
      // This prevents App.jsx from unmounting the Register page.
      .addCase(syncSellerProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(syncSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.seller = action.payload;
      })
      .addCase(syncSellerProfile.rejected, (state, action) => {
        state.loading = false;
        
        // FIX 2: Handle 404 (New User) correctly
        // User is Authenticated (Firebase) but has no Profile (MongoDB)
        if (action.payload?.status === 404) {
             state.isAuthenticated = true; 
             state.seller = null; 
        } else {
             state.isAuthenticated = false;
             state.seller = null;
             state.error = action.payload?.message;
        }
      })
      .addCase(logoutSeller.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.seller = null;
      });
  },
});

export const { setLoading, clearAuthError } = authSlice.actions;
export default authSlice.reducer;