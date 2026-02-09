import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch Dashboard Cards Stats (Revenue, Users, Orders, Products with trends)
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (timeRange = "all", { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/analytics/dashboard", {
        params: { timeRange }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Sales Graph Data
export const fetchSalesGraph = createAsyncThunk(
  "dashboard/fetchGraph",
  async (timeRange = "all", { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/analytics/graph", {
        params: { timeRange }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,       
    salesGraph: [],    
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
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Graph
      .addCase(fetchSalesGraph.fulfilled, (state, action) => {
        state.salesGraph = action.payload;
      });
  },
});

export default dashboardSlice.reducer;