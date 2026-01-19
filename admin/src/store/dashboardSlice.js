import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch Dashboard Stats (Cards)
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/analytics/dashboard");
      return response.data.data; // { totalUsers, totalRevenue, ... }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Fetch Sales Graph Data
export const fetchSalesGraph = createAsyncThunk(
  "dashboard/fetchGraph",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/analytics/graph");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      totalUsers: 0,
      totalSellers: 0,
      totalOrders: 0,
      totalRevenue: 0,
    },
    graphData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      // Graph
      .addCase(fetchSalesGraph.fulfilled, (state, action) => {
        state.graphData = action.payload;
      });
  },
});

export default dashboardSlice.reducer;