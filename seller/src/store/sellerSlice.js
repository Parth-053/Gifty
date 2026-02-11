import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

// --- 1. Fetch Full Seller Profile ---
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/seller/profile");
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// --- 2. Update Complete Profile (Personal, Store & Bank) ---
// Replaces the old separate update functions with one unified call
export const updateSellerProfile = createAsyncThunk(
  "seller/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      // Backend Route: PUT /api/v1/seller/profile
      const response = await axiosInstance.put("/seller/profile", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
  }
);

// --- 3. Soft Delete Seller Account ---
export const deleteSellerAccount = createAsyncThunk(
  "seller/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      // Backend Route: DELETE /api/v1/seller/profile
      const response = await axiosInstance.delete("/seller/profile");
      return response.data.message || "Account deleted successfully";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete account");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    profile: null,
    loading: false,
    actionLoading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearSellerMessages: (state) => {
      state.success = null;
      state.error = null;
    },
    clearSellerProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Profile ---
      .addCase(fetchSellerProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Profile ---
      .addCase(updateSellerProfile.pending, (state) => { 
        state.actionLoading = true; 
        state.success = null; 
        state.error = null; 
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload; // Update local state with fresh data
        state.success = "Profile updated successfully!";
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // --- Delete Account ---
      .addCase(deleteSellerAccount.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteSellerAccount.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = null; // Clear profile on successful delete
        state.success = action.payload;
      })
      .addCase(deleteSellerAccount.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSellerMessages, clearSellerProfile } = sellerSlice.actions;
export default sellerSlice.reducer;