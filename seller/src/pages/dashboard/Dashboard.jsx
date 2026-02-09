import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../store/dashboardSlice';
import Loader from '../../components/common/Loader';

// Components
import StatsGrid from '../../components/dashboard/StatsGrid';
import RecentOrders from '../../components/dashboard/RecentOrders';
import RevenueChart from '../../components/charts/RevenueChart'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentOrders, chartData, loading } = useSelector((state) => state.dashboard);
  
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    dispatch(fetchDashboardData(timeRange));
  }, [dispatch, timeRange]);

  const handleRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (loading && !stats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your store's performance.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">View:</span>
          <select
            value={timeRange}
            onChange={handleRangeChange}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm outline-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsGrid stats={stats} />

      {/* Charts & Orders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Revenue Chart (Takes 2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border capitalize">
              {timeRange === 'all' ? 'All Time' : timeRange}
            </span>
          </div>
          {/* Chart Container - Fills remaining height */}
          <div className="flex-1 w-full min-h-0">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Right: Recent Orders (Takes 1/3 width) */}
        {/* h-96 matches the chart height exactly */}
        <div className="lg:col-span-1 h-96">
          <RecentOrders orders={recentOrders} />
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;