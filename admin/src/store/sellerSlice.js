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
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Approve/Reject Seller
export const updateSellerStatus = createAsyncThunk(
  "sellers/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/approvals/sellers/${id}`, { status, reason });
      return { id, status, seller: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState: {
    pendingList: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingSellers.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        // Remove processed seller from pending list
        state.pendingList = state.pendingList.filter(s => s._id !== action.payload.id);
      });
  },
});

export default sellerSlice.reducer;