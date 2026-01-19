import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchSalesGraph } from '../../store/dashboardSlice'; 
import { Download, Calendar } from 'lucide-react';
import SalesChart from '../../components/charts/SalesChart';
import RevenueChart from '../../components/charts/RevenueChart';
import UsersChart from '../../components/charts/UsersChart';
import Loader from '../../components/common/Loader';

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats, graphData, loading } = useSelector((state) => state.dashboard);

  // 1. Fetch Real Data on Load
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchSalesGraph());
  }, [dispatch]);

  if (loading && !stats) return <Loader />;

  // Mock Target Logic (Backend can send this later)
  // For now, let's assume monthly target is ₹50,000 (Adjust as needed)
  const targetRevenue = 50000; 
  const currentRevenue = stats?.totalRevenue || 0;
  const progressPercent = Math.min((currentRevenue / targetRevenue) * 100, 100).toFixed(1);
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Analytics Reports</h1>
           <p className="text-sm text-gray-500">Overview of your store's performance.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm">
              <Calendar size={16} /> <span>{currentMonth}</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition">
              <Download size={16} /> Download PDF
           </button>
        </div>
      </div>

      {/* Charts Grid - Passing Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* We pass graphData prop so the chart component can map it */}
         <SalesChart data={graphData} />
         <RevenueChart data={graphData} totalRevenue={currentRevenue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <UsersChart totalUsers={stats?.totalUsers || 0} />
         </div>
         
         {/* Monthly Target Card (Dynamic) */}
         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
               <h3 className="text-lg font-bold mb-1">Monthly Target</h3>
               <p className="text-blue-200 text-sm mb-6">Revenue goal for {currentMonth}</p>
               
               <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
               </div>
               {/* Progress Bar */}
               <div className="w-full bg-blue-900/30 rounded-full h-2 mb-6">
                  <div 
                     className="bg-white h-2 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${progressPercent}%` }}
                  ></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Target</p>
                  <p className="text-xl font-extrabold">₹{targetRevenue.toLocaleString()}</p>
               </div>
               <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                  <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Achieved</p>
                  <p className="text-xl font-extrabold">₹{currentRevenue.toLocaleString()}</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Analytics;