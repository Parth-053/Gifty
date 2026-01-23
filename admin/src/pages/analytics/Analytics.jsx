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
  const [timeRange, setTimeRange] = useState("monthly"); // 'weekly', 'monthly', 'yearly'

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchSalesGraph(timeRange));
  }, [dispatch, timeRange]);

  const handleRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  // Fallback data if API returns null/undefined
  const cardData = stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  };

  // Mock graph data formatting if backend sends raw numbers
  // Ideally, backend sends [{ label: 'Jan', value: 100 }, ...]
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
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(cardData.totalRevenue)}
          icon={CurrencyRupeeIcon}
          color="green"
          trend={{ value: 12.5, isPositive: true }} // Mock trend for now
        />
        <StatsCard
          title="Total Orders"
          value={cardData.totalOrders}
          icon={ShoppingBagIcon}
          color="blue"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Total Users"
          value={cardData.totalUsers}
          icon={UsersIcon}
          color="purple"
          trend={{ value: 2.4, isPositive: true }}
        />
        <StatsCard
          title="Total Products"
          value={cardData.totalProducts}
          icon={ArchiveBoxIcon}
          color="orange"
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales (Bar Chart) */}
        <SalesChart data={chartData} />
        
        {/* Revenue (Area Chart) */}
        <RevenueChart data={chartData} />
      </div>

      {/* Full Width Chart */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Growth (Line Chart) */}
        <UsersChart data={chartData} /> 
      </div>
    </div>
  );
};

export default Analytics;