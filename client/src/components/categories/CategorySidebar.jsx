import React from 'react';

const CategorySidebar = ({ data, activeTab, onSelect }) => {
  return (
    <div className="w-[28%] bg-gray-50 h-full overflow-y-auto border-r border-gray-100 no-scrollbar pb-24">
      {data.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`
            relative flex flex-col items-center justify-center py-4 px-1 cursor-pointer transition-all duration-200 border-b border-gray-100
            ${activeTab === cat.id ? 'bg-white' : 'hover:bg-gray-100'}
          `}
        >
          {/* Active Indicator (Red Strip) */}
          {activeTab === cat.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B] rounded-r-md transition-all duration-300" />
          )}

          {/* Icon Circle */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all
            ${activeTab === cat.id ? 'bg-[#FF6B6B]/10 scale-105' : 'bg-transparent'}
          `}>
            <img 
              src={cat.icon} 
              alt={cat.name} 
              className={`w-6 h-6 object-contain transition-opacity ${activeTab === cat.id ? 'opacity-100' : 'opacity-50 grayscale'}`} 
            />
          </div>
          
          {/* Text Label */}
          <span className={`text-[10px] font-medium text-center leading-tight ${activeTab === cat.id ? 'text-[#FF6B6B] font-bold' : 'text-gray-500'}`}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategorySidebar;