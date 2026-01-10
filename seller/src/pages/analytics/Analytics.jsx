import React from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';

// Charts
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import OrdersChart from '../../components/charts/OrdersChart';

const Analytics = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
           <p className="text-sm text-gray-500">Detailed insights into your store's performance.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600">
              <Calendar size={16} />
              <span>Oct 2025</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-colors">
              <Download size={16} /> Report
           </button>
        </div>
      </div>

      {/* 2. Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
            <p className="text-blue-100 text-xs font-bold uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold mt-1">₹4,25,000</h3>
            <p className="text-xs bg-white/20 inline-block px-2 py-0.5 rounded mt-2">+12% vs last month</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase">Avg. Order Value</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">₹850</h3>
            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
               <TrendingUp size={12} /> +5.4%
            </p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase">Conversion Rate</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">2.4%</h3>
            <p className="text-xs text-red-500 font-bold mt-2">-0.1% vs last month</p>
         </div>
      </div>

      {/* 3. Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <SalesChart />
         <RevenueChart />
      </div>

      {/* 4. Bottom Section: Traffic & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Order Traffic (1 Col) */}
         <div className="lg:col-span-1">
            <OrdersChart />
         </div>

         {/* Top Products (2 Cols) */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[350px]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-gray-800">Top Selling Products</h3>
               <button className="text-xs font-bold text-blue-600">See All</button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                     <tr>
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Sold</th>
                        <th className="px-5 py-3">Earnings</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {[1, 2, 3, 4].map((i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                           <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-gray-200"></div> {/* Placeholder Img */}
                                 <span className="text-sm font-bold text-gray-800">Product Name {i}</span>
                              </div>
                           </td>
                           <td className="px-5 py-3 text-sm text-gray-600">₹499</td>
                           <td className="px-5 py-3 text-sm font-bold text-gray-800">{120 - (i*10)}</td>
                           <td className="px-5 py-3 text-sm font-bold text-green-600">₹{(120 - (i*10)) * 499}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

      </div>

    </div>
  );
};

export default Analytics;