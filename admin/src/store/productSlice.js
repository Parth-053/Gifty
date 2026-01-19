import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch Pending Products (For Approval Table)
export const fetchPendingProducts = createAsyncThunk(
  "products/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/approvals/products");
      return response.data.data; // Expecting array of products
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 2. Approve or Reject Product
export const updateProductStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      // Backend expects: { status: 'approved' | 'rejected', reason: '...' }
      const response = await api.post(`/admin/approvals/products/${id}`, { 
        status, 
        reason 
      });
      return { id, status, product: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [], // This will hold real data from DB
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Pending ---
      .addCase(fetchPendingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Status (Approve/Reject) ---
      .addCase(updateProductStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the processed product from the pending list
        state.list = state.list.filter((product) => product._id !== action.payload.id);
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;