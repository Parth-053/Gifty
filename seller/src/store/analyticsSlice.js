import { createSlice } from '@reduxjs/toolkit';

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    salesData: [],
    revenueData: [],
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0
    },
    loading: false
  },
  reducers: {
    updateAnalytics: (state, action) => {
      state.salesData = action.payload.sales;
      state.revenueData = action.payload.revenue;
      state.overview = action.payload.overview;
    }
  }
});

export const { updateAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;