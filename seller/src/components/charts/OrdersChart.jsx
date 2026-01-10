import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '09:00', orders: 12 },
  { time: '11:00', orders: 19 },
  { time: '13:00', orders: 35 },
  { time: '15:00', orders: 28 },
  { time: '17:00', orders: 42 },
  { time: '19:00', orders: 55 },
  { time: '21:00', orders: 30 },
];

const OrdersChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Order Traffic</h3>
        <p className="text-sm text-gray-500">Hourly orders today</p>
      </div>

      {/* ✅ FIX: Fixed Height Wrapper */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="time" 
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#8B5CF6" 
              strokeWidth={4} 
              dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;