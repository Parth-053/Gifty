import React from 'react';
import { Download, Calendar } from 'lucide-react';
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import UsersChart from '../../components/charts/UsersChart';

const Analytics = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Reports</h1>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600">
              <Calendar size={16} /> <span>Oct 2025</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold">
              <Download size={16} /> Download PDF
           </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <SalesChart />
         <RevenueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <UsersChart />
         </div>
         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-1">Monthly Target</h3>
            <p className="text-blue-200 text-sm mb-6">Revenue goal for October 2025</p>
            
            <div className="mb-2 flex justify-between text-sm font-bold">
               <span>Progress</span>
               <span>75%</span>
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-2 mb-6">
               <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-blue-200 uppercase font-bold">Target</p>
                  <p className="text-xl font-extrabold">₹15L</p>
               </div>
               <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-blue-200 uppercase font-bold">Achieved</p>
                  <p className="text-xl font-extrabold">₹11.2L</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Analytics;