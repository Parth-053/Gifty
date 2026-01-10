import React from 'react';
import { DollarSign, ShoppingBag, Users, Store, TrendingUp, ArrowUpRight } from 'lucide-react';

// Charts
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import UsersChart from '../../components/charts/UsersChart';

const Dashboard = () => {
  // Dummy Stats
  const stats = [
    { label: 'Total Revenue', value: '₹12,45,000', change: '+18%', isPositive: true, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: '3,250', change: '+12%', isPositive: true, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Active Users', value: '8,540', change: '+24%', isPositive: true, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Sellers', value: '156', change: '+5%', isPositive: true, icon: Store, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl text-white shadow-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-bold text-green-600">
              <ArrowUpRight size={14} />
              <span>{stat.change} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RevenueChart />
      </div>

      {/* User Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <UsersChart />
        </div>
        
        {/* Recent Activity Widget */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[350px] overflow-hidden flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                  <ShoppingBag size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">New Order #ORD-89{i}</p>
                  <p className="text-xs text-gray-500">2 mins ago • ₹4,500</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;