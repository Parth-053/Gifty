import React from 'react';

const StatsCard = ({ title, value, growth, isPositive, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(growth)}%
        </span>
        <span className="text-gray-400 ml-2">vs previous period</span>
      </div>
    </div>
  );
};

export default StatsCard;