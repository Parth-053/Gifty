import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsersChart = ({ data }) => {
  // Fallback
  const defaultData = [
    { day: '01', users: 0 },
    { day: '05', users: 0 },
    { day: '10', users: 0 },
    { day: '15', users: 0 },
    { day: '20', users: 0 },
    { day: '25', users: 0 },
    { day: '30', users: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">User Growth</h3>
        <p className="text-sm text-gray-500">New registrations trends</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" // Assuming backend returns 'day' or date string
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
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#8B5CF6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersChart;