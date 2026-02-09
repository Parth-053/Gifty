import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchSalesGraph } from "../../store/dashboardSlice";
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ArchiveBoxIcon 
} from "@heroicons/react/24/outline";

// Import Components
import StatsCard from "../../components/common/StatsCard";
import SalesChart from "../../components/charts/SalesChart";
import RevenueChart from "../../components/charts/RevenueChart";
import UsersChart from "../../components/charts/UsersChart";
import Loader from "../../components/common/Loader";
import formatCurrency from "../../utils/formatCurrency";

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats, salesGraph, loading } = useSelector((state) => state.dashboard);
  
  // Default to "week" to show meaningful trend data initially
  const [timeRange, setTimeRange] = useState("week"); 

  useEffect(() => {
    // Pass the timeRange filter to the Redux actions
    dispatch(fetchDashboardStats(timeRange));
    dispatch(fetchSalesGraph(timeRange));
  }, [dispatch, timeRange]);

  const handleRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // Helper to determine the dynamic label text (e.g., "from last week")
  const getTrendLabel = () => {
    switch (timeRange) {
      case "today": return "from yesterday";
      case "yesterday": return "from day before";
      case "week": return "from last week";
      case "year": return "from last year";
      case "all": return ""; // No trend for all time
      default: return "";
    }
  };

  const trendLabel = getTrendLabel();
  const showTrend = timeRange !== "all";

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  // Handle nested structure from the updated Backend
  // Structure: { value: 1000, percentage: 10, isPositive: true }
  const data = stats || {
    revenue: { value: 0, percentage: 0, isPositive: true },
    orders: { value: 0, percentage: 0, isPositive: true },
    users: { value: 0, percentage: 0, isPositive: true },
    products: { value: 0, percentage: 0, isPositive: true }
  };

  const chartData = salesGraph || []; 

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your business performance</p>
        </div>
        
        <select
          value={timeRange}
          onChange={handleRangeChange}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm outline-none cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 7 Days</option>
          <option value="year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.revenue?.value || 0)}
          icon={CurrencyRupeeIcon}
          color="green"
          trend={showTrend ? { 
            value: data.revenue?.percentage || 0, 
            isPositive: data.revenue?.isPositive,
            label: trendLabel
          } : null}
        />
        <StatsCard
          title="Total Orders"
          value={data.orders?.value || 0}
          icon={ShoppingBagIcon}
          color="blue"
          trend={showTrend ? { 
            value: data.orders?.percentage || 0, 
            isPositive: data.orders?.isPositive,
            label: trendLabel
          } : null}
        />
        <StatsCard
          title="Total Users"
          value={data.users?.value || 0}
          icon={UsersIcon}
          color="purple"
          trend={showTrend ? { 
            value: data.users?.percentage || 0, 
            isPositive: data.users?.isPositive,
            label: trendLabel
          } : null}
        />
        <StatsCard
          title="Total Products"
          value={data.products?.value || 0}
          icon={ArchiveBoxIcon}
          color="orange"
          trend={showTrend ? { 
            value: data.products?.percentage || 0, 
            isPositive: data.products?.isPositive,
            label: trendLabel
          } : null}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales (Bar Chart) */}
        <SalesChart data={chartData} />
        
        {/* Revenue (Area Chart) */}
        <RevenueChart data={chartData} />
      </div>

      {/* Full Width Chart - User Growth */}
      {/* Note: Ensure UsersChart can handle the graph data structure */}
      <div className="grid grid-cols-1 gap-6">
        <UsersChart data={chartData} /> 
      </div>
    </div>
  );
};

export default Analytics;