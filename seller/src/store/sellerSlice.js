import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { syncSeller } from "./authSlice";

// --- Thunk: Update Store/Profile Details ---
export const updateSellerProfile = createAsyncThunk(
  "seller/updateProfile",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put("/seller/profile", formData);
      toast.success("Profile updated successfully");

      // Critical: Refresh the global auth state to reflect changes in Navbar/Sidebar
      await dispatch(syncSeller());

      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// --- Thunk: Update Bank Details ---
export const updateBankDetails = createAsyncThunk(
  "seller/updateBankDetails",
  async (bankData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put("/seller/bank-details", bankData);
      toast.success("Bank details updated successfully");

      // Refresh global state
      await dispatch(syncSeller());

      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update bank details";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    resetSellerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSellerProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Bank Details
      .addCase(updateBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBankDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
