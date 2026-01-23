import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch Pending Sellers
export const fetchPendingSellers = createAsyncThunk(
  "sellers/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/approvals/sellers");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch All Sellers
export const fetchSellers = createAsyncThunk(
  "sellers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming a route exists to get all sellers
      const response = await api.get("/admin/users?role=seller"); 
      return response.data.data.users; // Adjust based on your API response structure
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Approve/Reject Seller
export const updateSellerStatus = createAsyncThunk(
  "sellers/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/approvals/sellers/${id}`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState: {
    sellers: [],
    pendingSellers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingSellers.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingSellers = action.payload;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.pendingSellers = state.pendingSellers.filter(s => s._id !== action.payload._id);
        const index = state.sellers.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.sellers[index] = action.payload;
      });
  },
});

export default sellerSlice.reducer;