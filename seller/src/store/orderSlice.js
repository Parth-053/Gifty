import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null,
    loading: false,
    stats: {
      pending: 12,
      shipped: 5,
      delivered: 120,
    }
  },
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.list.find(o => o.id === id);
      if (order) {
        order.status = status;
      }
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    }
  }
});

export const { setOrders, updateOrderStatus, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;