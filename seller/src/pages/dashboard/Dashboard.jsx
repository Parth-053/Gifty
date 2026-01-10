import React from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Users, Clock } from 'lucide-react';

// Charts
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import OrdersChart from '../../components/charts/OrdersChart';

const Dashboard = () => {
  // Dummy Stats
  const stats = [
    { label: 'Total Revenue', value: '₹4,25,000', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: '1,250', change: '+8.2%', isPositive: true, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Products Sold', value: '856', change: '-2.4%', isPositive: false, icon: Package, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Customers', value: '2,300', change: '+15%', isPositive: true, icon: Users, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 outline-none shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all">
            Download Report
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-3 text-xs font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{stat.change} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Chart (Occupies 2 columns) */}
        <div className="lg:col-span-2">
           <SalesChart />
        </div>
        {/* Orders Chart (Occupies 1 column) */}
        <div>
           <OrdersChart />
        </div>
      </div>

      {/* 4. Revenue & Recent Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <RevenueChart />
         
         {/* Recent Orders Widget */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                           <ShoppingBag size={18} className="text-gray-400" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-800">#ORD-00{i}</p>
                           <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={10} /> 2 mins ago
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{499 * i}</p>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">Pending</span>
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