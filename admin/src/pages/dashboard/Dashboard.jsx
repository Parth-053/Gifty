import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchSalesGraph } from "../../store/dashboardSlice";
import { fetchOrders } from "../../store/orderSlice";  
// Components
import StatsGrid from "../../components/dashboard/StatsGrid";
import RecentOrders from "../../components/dashboard/RecentOrders";
import SalesChart from "../../components/charts/SalesChart";
import RevenueChart from "../../components/charts/RevenueChart";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Selectors
  const { stats, salesGraph, loading: dashboardLoading } = useSelector((state) => state.dashboard);
  const { orders: recentOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  
  // Local State
  const [graphPeriod, setGraphPeriod] = useState("monthly");

  useEffect(() => {
    // 1. Fetch Key Stats
    dispatch(fetchDashboardStats());
    
    // 2. Fetch Graph Data
    dispatch(fetchSalesGraph(graphPeriod));

    // 3. Fetch Recent Orders (Limit 5)
    // We reuse the existing fetchOrders action but pass params
    dispatch(fetchOrders({ page: 1, limit: 5, sort: "-createdAt" }));
  }, [dispatch, graphPeriod]);

  // Loading State
  const isLoading = dashboardLoading || ordersLoading;

  if (isLoading && !stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Admin! Here's what's happening with your store today.
          </p>
        </div>
        
        {/* Time Filter for Graphs */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View:</span>
          <select
            value={graphPeriod}
            onChange={(e) => setGraphPeriod(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 shadow-sm"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">This Year (Monthly)</option>
          </select>
        </div>
      </div>

      {/* 1. Key Statistics Grid */}
      <StatsGrid stats={stats} loading={dashboardLoading} />

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesGraph || []} />
        <RevenueChart data={salesGraph || []} />
      </div>

      {/* 3. Recent Orders Table */}
      <RecentOrders orders={recentOrders} loading={ordersLoading} />
      
    </div>
  );
};

export default Dashboard;