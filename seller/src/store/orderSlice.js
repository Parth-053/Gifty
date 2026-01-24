import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch Orders List
export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchAll",
  async ({ page = 1, limit = 10, status = "" } = {}, { rejectWithValue }) => {
    try {
      let query = `/seller/orders?page=${page}&limit=${limit}`;
      if (status) query += `&orderStatus=${status}`;
      
      const response = await api.get(query);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 2. Fetch Single Order Details
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOne",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/seller/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);

// 3. Update Item Status
export const updateItemStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, itemId, status }, { rejectWithValue }) => {
    try {
      await api.patch(`/seller/orders/${orderId}/items/${itemId}`, { status });
      return { orderId, itemId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchSellerOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        // Pagination data assumed from API response
        state.currentPage = action.payload.page || 1; 
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch One
      .addCase(fetchOrderDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        const { itemId, status } = action.payload;
        // Update in current order if open
        if (state.currentOrder) {
          const item = state.currentOrder.items.find(i => i._id === itemId);
          if (item) item.status = status;
        }
        // Ideally, update list too if needed
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;