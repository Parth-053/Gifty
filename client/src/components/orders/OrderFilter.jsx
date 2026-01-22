import React from 'react';

const filters = [
  { id: 'all', label: 'All Orders' },
  { id: 'Processing', label: 'Processing' },
  { id: 'Shipped', label: 'Shipped' },
  { id: 'Delivered', label: 'Delivered' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const OrderFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
            ${activeFilter === filter.id 
              ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default OrderFilter;