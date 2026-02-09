import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch All Coupons
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (queryParams, { rejectWithValue }) => {
    try {
      // Pass queryParams for pagination/search if needed
      const response = await api.get("/admin/coupons", { params: queryParams });
      return response.data.data; // Returns object: { coupons: [], total: N }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Single Coupon (For Edit)
export const fetchCouponDetails = createAsyncThunk(
  "coupons/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/coupons/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Coupon
export const createCoupon = createAsyncThunk(
  "coupons/create",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/coupons", couponData);
      return response.data.data; // Returns the single created coupon object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Coupon
export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/coupons/${id}`, couponData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Coupon
export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],       // MUST be an array
    total: 0,          // Store total count separately
    selectedCoupon: null, 
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCoupons.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        // FIX: Extract the array from the payload object
        state.coupons = action.payload.coupons || []; 
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch One
      .addCase(fetchCouponDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchCouponDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCoupon = action.payload;
      })
      .addCase(fetchCouponDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createCoupon.fulfilled, (state, action) => {
        // Now safe because state.coupons is guaranteed to be an array
        state.coupons.push(action.payload);
        state.total += 1; // Optional: update total count
      })

      // Update
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.coupons[index] = action.payload;
        state.selectedCoupon = action.payload;
      })

      // Delete
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
        state.total -= 1; // Optional: update total count
      });
  },
});

export const { clearSelectedCoupon } = couponSlice.actions;
export default couponSlice.reducer;