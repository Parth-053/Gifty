import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchSellerOrders = createAsyncThunk('order/fetchAll', async () => {
  const response = await api.get('/seller/orders');
  return response.data.data;
});
 
export const fetchOrderById = createAsyncThunk('order/fetchById', async (id) => {
  const response = await api.get(`/seller/orders/${id}`);
  return response.data.data;
});

export const updateOrderState = createAsyncThunk('order/updateStatus', async ({ orderId, itemId, status }) => {
  const response = await api.put(`/seller/orders/${orderId}/item/${itemId}`, { status });
  return response.data.data;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: { orders: [], currentOrder: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.currentOrder = action.payload; });
  }
});

export default orderSlice.reducer;