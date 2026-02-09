import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UsersChart = ({ data }) => {
  const safeData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">New Users</h3>
      
      {/* Responsive Height Container */}
      <div className="w-full h-72 md:h-96 min-h-[300px]">
        {safeData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6B7280", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6B7280", fontSize: 12 }} 
                width={40}
              />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ r: 4, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No user data available
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersChart;