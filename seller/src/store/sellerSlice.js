import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

// --- 1. Fetch Full Profile ---
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/seller/profile");
      // Returns { _id, storeName, bankDetails, user: { fullName, email, avatar }, ... }
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// --- 2. Update Personal Info (User Identity) ---
export const updatePersonalInfo = createAsyncThunk(
  "seller/updatePersonalInfo",
  async (formData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      // Backend Route: PUT /api/v1/seller/profile/personal
      const response = await axiosInstance.put("/seller/profile/personal", formData, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Personal update failed");
    }
  }
);

// --- 3. Update Store Settings (Business Info) ---
export const updateStoreProfile = createAsyncThunk(
  "seller/updateStoreProfile",
  async (data, { rejectWithValue }) => {
    try {
      // Backend Route: PUT /api/v1/seller/profile
      const response = await axiosInstance.put("/seller/profile", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Store update failed");
    }
  }
);

// --- 4. Update Bank Details (Finance) ---
export const updateBankDetails = createAsyncThunk(
  "seller/updateBankDetails",
  async (data, { rejectWithValue }) => {
    try {
      // Backend Route: PUT /api/v1/seller/bank-details
      const response = await axiosInstance.put("/seller/bank-details", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Bank update failed");
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSellerProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Actions (Generic handler for all 3 updates to save space)
      .addMatcher(
        (action) => [updatePersonalInfo.pending, updateStoreProfile.pending, updateBankDetails.pending].includes(action.type),
        (state) => { state.actionLoading = true; state.success = null; state.error = null; }
      )
      .addMatcher(
        (action) => [updatePersonalInfo.fulfilled, updateStoreProfile.fulfilled, updateBankDetails.fulfilled].includes(action.type),
        (state, action) => {
          state.actionLoading = false;
          state.profile = action.payload; // Update local state with fresh data
          state.success = "Profile updated successfully!";
        }
      )
      .addMatcher(
        (action) => [updatePersonalInfo.rejected, updateStoreProfile.rejected, updateBankDetails.rejected].includes(action.type),
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearSellerMessages } = sellerSlice.actions;
export default sellerSlice.reducer;