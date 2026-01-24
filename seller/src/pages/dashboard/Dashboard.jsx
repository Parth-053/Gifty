import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Loader2 
} from 'lucide-react';

// Components & Actions
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import { fetchDashboardStats, fetchDashboardChart } from '../../store/dashboardSlice';
import { fetchSellerOrders } from '../../store/orderSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatRelativeTime } from '../../utils/formatDate';

// Stat Card Component (Internal for cleaner code)
const DashboardStatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  // Selectors
  const { stats, chartData, loading } = useSelector((state) => state.dashboard);
  const { orders = [] } = useSelector((state) => state.orders || { orders: [] }); // Fallback if order slice isn't ready

  useEffect(() => {
    // 1. Fetch Summary Stats
    dispatch(fetchDashboardStats());
    // 2. Fetch Chart Data (Graph)
    dispatch(fetchDashboardChart());
    // 3. Fetch Recent Orders
    dispatch(fetchSellerOrders({ page: 1, limit: 5 }));
  }, [dispatch]);

  if (loading && !stats.totalRevenue) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
          <p className="text-gray-500 font-medium">Loading store insights...</p>
        </div>
      </div>
    );
  }

  // Transform Chart Data for Recharts (Backend sends _id, dailyRevenue)
  const formattedChartData = chartData.map(item => ({
    name: item._id, // Date
    revenue: item.dailyRevenue,
    orders: item.dailyOrders
  }));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your store's performance</p>
        </div>
        <button 
          onClick={() => navigate('/products/add')}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Package size={18} /> Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
          title="Total Revenue"
          value={formatPrice(stats?.totalRevenue || 0)}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
          trend="+12%" // Static for now, can be calculated if previous data exists
        />
        <DashboardStatCard 
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="bg-blue-100 text-blue-600"
        />
        <DashboardStatCard 
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="bg-purple-100 text-purple-600"
        />
        <DashboardStatCard 
          title="Conversion Rate"
          value="3.5%" // Placeholder until implemented in backend
          icon={TrendingUp}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (Last 7 Days)</h3>
          {/* Ensure your RevenueChart component accepts 'data' prop with 'revenue' key */}
          <RevenueChart data={formattedChartData} />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Volume</h3>
          {/* Reuse SalesChart or generic chart for orders */}
          <SalesChart data={formattedChartData} dataKey="orders" color="#3B82F6" />
        </div>
      </div>

      {/* Recent Orders & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button 
              onClick={() => navigate('/orders')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <ShoppingBag size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No orders found. Your sales journey begins soon!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
             <button 
                onClick={() => navigate('/orders?status=pending')}
                className="w-full flex items-center justify-between p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group text-left"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg text-yellow-600 shadow-sm">
                     <Clock size={18} />
                   </div>
                   <span className="text-sm font-semibold text-gray-700">Pending Orders</span>
                </div>
                <ArrowUpRight size={16} className="text-gray-400 group-hover:text-yellow-600" />
             </button>

             <button 
                onClick={() => navigate('/analytics')}
                className="w-full flex items-center justify-between p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group text-left"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                     <TrendingUp size={18} />
                   </div>
                   <span className="text-sm font-semibold text-gray-700">View Analytics</span>
                </div>
                <ArrowUpRight size={16} className="text-gray-400 group-hover:text-indigo-600" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;