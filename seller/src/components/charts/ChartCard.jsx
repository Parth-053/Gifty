import React from 'react';

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs font-medium text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default ChartCard;