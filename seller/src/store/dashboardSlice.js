import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Thunk now accepts 'timeRange' parameter
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (timeRange = "week", { rejectWithValue }) => {
    try {
      // Pass query param to backend
      const [statsRes, chartRes] = await Promise.all([
        api.get(`/seller/dashboard/stats?timeRange=${timeRange}`),
        api.get(`/seller/dashboard/chart?timeRange=${timeRange}`)
      ]);
      
      return {
        stats: statsRes.data.data.stats,
        recentOrders: statsRes.data.data.recentOrders,
        chartData: chartRes.data.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    recentOrders: [],
    chartData: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        // Map chart data for Recharts (handling API returning _id as name)
        state.chartData = action.payload.chartData.map(item => ({
            name: item._id, // Format this date if needed in the UI component
            revenue: item.revenue
        }));
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;