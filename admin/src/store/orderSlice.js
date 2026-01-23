import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders", { params });
      return response.data.data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);  
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    totalOrders: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalDocs;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update in list
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
        // Update current view
        if (state.currentOrder?._id === action.payload._id) {
            state.currentOrder = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;