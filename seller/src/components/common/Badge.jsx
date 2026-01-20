import React from 'react';
import { ORDER_STATUS } from '../../utils/constants';

const Badge = ({ status }) => {
  const config = ORDER_STATUS[status?.toUpperCase()] || { 
    label: status, 
    color: 'bg-gray-50 text-gray-600', 
    border: 'border-gray-100' 
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${config.color} ${config.border} transition-all`}>
      {config.label}
    </span>
  );
};

export default Badge;