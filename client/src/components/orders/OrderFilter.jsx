import React from 'react';

const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderFilter = ({ activeFilter, setFilter }) => {
  return (
    <div className="bg-white sticky top-[60px] z-10 px-4 py-3 shadow-sm border-b border-gray-100 flex gap-3 overflow-x-auto no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`
            px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border
            ${activeFilter === filter 
              ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-md shadow-[#FF6B6B]/20' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default OrderFilter;