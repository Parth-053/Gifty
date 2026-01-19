import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-4 text-xs font-medium">
          {trend === 'up' ? (
            <span className="text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight size={12} className="mr-1" /> {trendValue}
            </span>
          ) : (
            <span className="text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight size={12} className="mr-1" /> {trendValue}
            </span>
          )}
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;