import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Calendar, TrendingUp, Loader2, DollarSign, ShoppingBag, Package } from 'lucide-react';

// Charts & Store Actions
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import OrdersChart from '../../components/charts/OrdersChart';
import { fetchDashboardData } from '../../store/analyticsSlice';
import { formatPrice } from '../../utils/formatPrice';

const Analytics = () => {
  const dispatch = useDispatch();
  
  // Redux store se data fetch karna
  const { salesData, revenueData, overview, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    // Initial data fetch call
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Export Feature */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
           <p className="text-sm text-gray-500">Track your store's sales performance and revenue growth.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Calendar size={16} /> Last 30 Days
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-colors">
              <Download size={16} /> Export Report
           </button>
        </div>
      </div>

      {/* 2. Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
               <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <p className="text-sm font-bold text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-900">{formatPrice(overview.totalRevenue)}</h3>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={24} /></div>
               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+8.2%</span>
            </div>
            <p className="text-sm font-bold text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{overview.totalOrders}</h3>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Package size={24} /></div>
            </div>
            <p className="text-sm font-bold text-gray-500">Active Products</p>
            <h3 className="text-2xl font-black text-gray-900">{overview.totalProducts}</h3>
         </div>
      </div>

      {/* 3. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Revenue Growth</h3>
            <RevenueChart data={revenueData} />
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Sales Volume</h3>
            <SalesChart data={salesData} />
         </div>
      </div>

      {/* 4. Order Analytics Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
         <h3 className="font-bold text-gray-800 mb-6">Order Status Breakdown</h3>
         <div className="h-[300px]">
            <OrdersChart />
         </div>
      </div>

    </div>
  );
};

export default Analytics;