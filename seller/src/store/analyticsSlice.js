import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch Stats (Cards)
export const fetchAnalyticsStats = createAsyncThunk(
  "analytics/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/finance/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// 2. Fetch Graph Data
export const fetchSalesGraph = createAsyncThunk(
  "analytics/fetchGraph",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/finance/graph");
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
        state.stats = action.payload;
      })
      .addCase(fetchAnalyticsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Graph
      .addCase(fetchSalesGraph.fulfilled, (state, action) => {
        state.graphData = action.payload;
      });
  },
});

export default analyticsSlice.reducer;