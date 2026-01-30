import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch Pending Sellers
export const fetchPendingSellers = createAsyncThunk(
  "sellers/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      // Must match the backend route defined above
      const response = await api.get("/admin/approvals/sellers");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch requests");
    }
  }
);

// Approve/Reject Seller
export const verifySeller = createAsyncThunk(
  "sellers/verify",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/approvals/sellers/${id}`, { 
        status, 
        rejectionReason: reason 
      });
      return { id, status, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Action failed");
    }
  }
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState: {
    pendingSellers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Pending
      .addCase(fetchPendingSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingSellers = action.payload;
      })
      .addCase(fetchPendingSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Action
      .addCase(verifySeller.fulfilled, (state, action) => {
        // Remove the processed seller from the pending list
        state.pendingSellers = state.pendingSellers.filter(
          (seller) => seller._id !== action.payload.id
        );
      });
  },
});

export default sellerSlice.reducer;