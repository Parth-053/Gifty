import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ data }) => {
  // Fallback
  const defaultData = [
    { name: 'Mon', revenue: 0, profit: 0 },
    { name: 'Tue', revenue: 0, profit: 0 },
    { name: 'Wed', revenue: 0, profit: 0 },
    { name: 'Thu', revenue: 0, profit: 0 },
    { name: 'Fri', revenue: 0, profit: 0 },
    { name: 'Sat', revenue: 0, profit: 0 },
    { name: 'Sun', revenue: 0, profit: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Revenue Analytics</h3>
          <p className="text-sm text-gray-500">Revenue vs Profit Comparison</p>
        </div>
        {/* Filter logic can be added later */}
        <select className="text-xs bg-gray-50 border-none rounded-lg p-2 font-medium text-gray-600 outline-none cursor-pointer">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} name="Revenue" />
            <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;