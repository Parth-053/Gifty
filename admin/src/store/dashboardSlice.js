import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalSales: 425000,
      totalOrders: 1250,
      totalUsers: 3400,
      totalSellers: 56
    },
    salesChartData: [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
    ],
    recentOrders: [],
    loading: false
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.stats = action.payload.stats;
      state.salesChartData = action.payload.salesChartData;
    }
  },
});

export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;