import React from 'react';

// Fake Data
const categories = [
  { name: 'Birthday', img: 'https://cdn-icons-png.flaticon.com/512/2488/2488980.png' },
  { name: 'Wedding', img: 'https://cdn-icons-png.flaticon.com/512/2706/2706950.png' },
  { name: 'Anniversary', img: 'https://cdn-icons-png.flaticon.com/512/1164/1164620.png' },
  { name: 'For Him', img: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' },
  { name: 'For Her', img: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png' },
  { name: 'Flowers', img: 'https://cdn-icons-png.flaticon.com/512/10752/10752182.png' },
];

const CategoryRail = () => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center px-4 mb-3">
        <h2 className="font-bold text-gray-800 text-base">Shop by Category</h2>
        <span className="text-xs text-[#FF6B6B] font-semibold">View All</span>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide">
        {categories.map((cat, index) => (
          <div key={index} className="flex flex-col items-center flex-shrink-0 w-[70px]">
            <div className="w-[65px] h-[65px] rounded-full p-1 border-2 border-[#FF6B6B] flex items-center justify-center bg-white shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                 <img src={cat.img} alt={cat.name} className="w-10 h-10 object-contain" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-2 text-center leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRail;