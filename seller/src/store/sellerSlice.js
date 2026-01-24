import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { syncSellerProfile } from "./authSlice";  

// 1. Fetch Seller Profile (Full Data)
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/profile");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// 2. Update Personal Info (Name, Phone, Avatar)
export const updatePersonalInfo = createAsyncThunk(
  "seller/updatePersonal",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      // formData contains name, phone, avatar(file)
      const response = await api.patch("/seller/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(syncSellerProfile()); // Refresh global auth state
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// 3. Update Store Settings (Name, Description, Address)
export const updateStoreSettings = createAsyncThunk(
  "seller/updateStore",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch("/seller/store", data);
      dispatch(syncSellerProfile());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// 4. Update Bank Details
export const updateBankDetails = createAsyncThunk(
  "seller/updateBank",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.patch("/seller/bank-details", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    profile: null,
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSellerMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
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

      // Update Personal
      .addCase(updatePersonalInfo.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update Store
      .addCase(updateStoreSettings.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateStoreSettings.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;
        state.successMessage = "Store settings saved!";
      })
      .addCase(updateStoreSettings.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update Bank
      .addCase(updateBankDetails.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;  
        state.successMessage = "Bank details updated!";
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSellerMessages } = sellerSlice.actions;
export default sellerSlice.reducer;