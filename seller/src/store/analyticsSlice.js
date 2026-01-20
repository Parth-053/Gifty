import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/finance/stats');
      return response.data.data;
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
    overview: { totalRevenue: 0, totalOrders: 0, totalProducts: 0 },
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.salesData = action.payload.sales;
      });
  }
});

export default analyticsSlice.reducer;