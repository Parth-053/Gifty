import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Package, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, Loader2 
} from 'lucide-react';

// Charts & Store Actions
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import OrdersChart from '../../components/charts/OrdersChart';
import { fetchDashboardData } from '../../store/analyticsSlice';
import { fetchSellerOrders } from '../../store/orderSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatRelativeTime } from '../../utils/formatDate';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  const { overview = {}, salesData = [], loading: analyticsLoading } = useSelector((state) => state.analytics || {});
  const { orders = [], loading: ordersLoading } = useSelector((state) => state.order || {});

  useEffect(() => {
    // Parallelly fetching dashboard stats and recent orders
    dispatch(fetchDashboardData());
    dispatch(fetchSellerOrders());
  }, [dispatch]);
 
  const stats = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(overview?.totalRevenue || 0), 
      change: '+12.5%', 
      isPositive: true, 
      icon: DollarSign, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Total Orders', 
      value: overview?.totalOrders || 0, 
      change: '+5.2%', 
      isPositive: true, 
      icon: ShoppingBag, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      label: 'Active Products', 
      value: overview?.totalProducts || 0, 
      change: '-2.1%', 
      isPositive: false, 
      icon: Package, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      label: 'Conversion Rate', 
      value: '3.2%', 
      change: '+1.4%', 
      isPositive: true, 
      icon: TrendingUp, 
      color: 'bg-orange-50 text-orange-600' 
    },
  ];

  if (analyticsLoading || ordersLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
          <p className="text-gray-500 font-medium italic">Loading your boutique stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* --- Welcome Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 font-medium">Detailed insights into your store's performance.</p>
        </div>
        <button 
          onClick={() => navigate('/inventory/add')}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg"
        >
          <Package size={18} /> Add New Product
        </button>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {item.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h3>
          <RevenueChart data={salesData} />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Order Trends</h3>
          <OrdersChart data={salesData} />
        </div>
      </div>

      {/* --- Recent Activity --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button 
              onClick={() => navigate('/orders')}
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">#{order.orderId || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 italic text-sm">No recent orders to show.</div>
            )}
          </div>
        </div>

        {/* Sales Performance Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
             <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                   <Clock className="text-blue-600" size={20} />
                   <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">View Pending Orders</span>
                </div>
                <ArrowUpRight size={18} className="text-gray-400" />
             </button>
             <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-purple-50 transition-colors group">
                <div className="flex items-center gap-3">
                   <TrendingUp className="text-purple-600" size={20} />
                   <span className="text-sm font-bold text-gray-700 group-hover:text-purple-700">Check Analytics</span>
                </div>
                <ArrowUpRight size={18} className="text-gray-400" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;