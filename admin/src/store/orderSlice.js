import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch All Orders (With Pagination & Filters)
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async ({ page = 1, status = "", search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders?page=${page}&status=${status}&search=${search}`);
      return response.data.data; // { orders, total, pages }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 2. Fetch Single Order Details
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Order not found");
    }
  }
);

// 3. Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/orders/${id}/status`, { status });
      return { id, status, updatedOrder: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    currentOrder: null,
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.orders;
        state.total = action.payload.total;
        state.totalPages = action.payload.pages;
      })
      // Fetch Details
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.currentOrder && state.currentOrder._id === action.payload.id) {
          state.currentOrder.orderStatus = action.payload.status;
        }
        // Update in list as well
        const index = state.list.findIndex(o => o._id === action.payload.id);
        if (index !== -1) state.list[index].orderStatus = action.payload.status;
      });
  },
});

export default orderSlice.reducer;