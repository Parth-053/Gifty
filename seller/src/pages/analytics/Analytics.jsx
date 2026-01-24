import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalyticsStats, fetchSalesGraph } from "../../store/analyticsSlice";
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  ArrowTrendingUpIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import Loader from "../../components/common/Loader";
import SalesChart from "../../components/charts/SalesChart";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center transition-transform hover:-translate-y-1 duration-200">
    <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
      {/* Icon is used here as a component */}
      <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats, graphData, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsStats());
    dispatch(fetchSalesGraph());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <button 
          onClick={() => { dispatch(fetchAnalyticsStats()); dispatch(fetchSalesGraph()); }}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors hover:bg-indigo-100"
        >
          <ArrowTrendingUpIcon className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* 1. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={CurrencyRupeeIcon} 
          color="bg-green-500 text-green-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingBagIcon} 
          color="bg-blue-500 text-blue-600"
        />
        <StatCard 
          title="Active Products" 
          value={stats?.totalProducts || 0} 
          icon={CubeIcon} 
          color="bg-indigo-500 text-indigo-600"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats?.pendingOrders || 0} 
          icon={ArchiveBoxIcon} 
          color="bg-yellow-500 text-yellow-600"
        />
      </div>

      {/* 2. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart data={graphData} />
        </div>

        {/* Financial Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Net Income</span>
                <span className="text-sm font-semibold text-green-600">
                  ₹{stats?.netIncome?.toLocaleString() || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Earnings after commission</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Withdrawable Balance</span>
                <span className="text-sm font-semibold text-indigo-600">
                  ₹{stats?.withdrawableAmount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Available for payout</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{stats?.totalOrders > 0 
                      ? Math.round(stats.totalRevenue / stats.totalOrders) 
                      : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;