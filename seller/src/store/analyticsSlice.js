import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/finance/stats');
      // Ensure we return an object, even if data is missing
      return response.data.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    salesData: [],
    revenueData: [],
    // Initial state prevents crash on first render
    overview: { totalRevenue: 0, totalOrders: 0, totalProducts: 0 },
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        // FIX: Use Optional Chaining (?.) and Fallback (||) to prevent undefined
        state.overview = action.payload?.overview || { totalRevenue: 0, totalOrders: 0, totalProducts: 0 };
        state.salesData = action.payload?.sales || [];
        state.revenueData = action.payload?.revenue || [];  
      })
      .addCase(fetchDashboardData.rejected, (state) => {
        state.loading = false;
      });
  }
});

export default analyticsSlice.reducer;