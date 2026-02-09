import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import formatCurrency from "../../utils/formatCurrency";

const RevenueChart = ({ data }) => {
  const safeData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Analytics</h3>
      
      {/* Responsive Height Container: h-72 (288px) on mobile, h-96 (384px) on desktop */}
      <div className="w-full h-72 md:h-96 min-h-[300px]">
        {safeData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={safeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6B7280", fontSize: 12 }} 
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6B7280", fontSize: 12 }} 
                tickFormatter={(val) => `₹${val}`}
                width={60} // Fixed width prevents jumpiness
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), "Revenue"]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No revenue data available
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;