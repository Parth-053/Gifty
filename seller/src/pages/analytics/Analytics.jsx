import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalyticsStats, fetchSalesGraph } from "../../store/analyticsSlice";
import Loader from "../../components/common/Loader";

// Components
import StatsGrid from "../../components/dashboard/StatsGrid";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats, graphData, loading } = useSelector((state) => state.analytics);
  
  // Time Filter State
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    dispatch(fetchAnalyticsStats(timeRange));
    dispatch(fetchSalesGraph(timeRange));
  }, [dispatch, timeRange]);

  const handleRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (loading && !stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Analyze your store performance and trends.</p>
        </div>

        {/* Dynamic Filter */}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <RevenueChart data={graphData} />
        </div>

        {/* Sales/Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Volume</h3>
          <SalesChart data={graphData} />
        </div>

      </div>
    </div>
  );
};

export default Analytics;