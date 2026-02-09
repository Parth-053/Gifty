import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch Stats (Cards) - Supports Time Filter
export const fetchAnalyticsStats = createAsyncThunk(
  "analytics/fetchStats",
  async (timeRange = "week", { rejectWithValue }) => {
    try {
      // Reusing the dynamic dashboard endpoint which supports filtering
      const response = await api.get(`/seller/dashboard/stats?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// 2. Fetch Graph Data - Supports Time Filter
export const fetchSalesGraph = createAsyncThunk(
  "analytics/fetchGraph",
  async (timeRange = "week", { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/dashboard/chart?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch graph");
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    stats: null,
    graphData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAnalyticsStats.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalyticsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats; // Accessing .stats from the response structure
      })
      .addCase(fetchAnalyticsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Graph
      .addCase(fetchSalesGraph.fulfilled, (state, action) => {
        // Map backend data to Recharts format if needed
        state.graphData = action.payload.map(item => ({
          name: item.name || item._id, 
          revenue: item.revenue,
          orders: item.orders || 0
        }));
      });
  },
});

export default analyticsSlice.reducer;