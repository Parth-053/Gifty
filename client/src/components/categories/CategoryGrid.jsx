import React from 'react';

const CategoryGrid = ({ data }) => {
  return (
    <div className="w-[72%] h-full overflow-y-auto bg-white p-4 pb-32 no-scrollbar scroll-smooth" id="right-scroll-container">
      
      {data.map((category) => (
        // ✅ Every category gets a specific ID (e.g., id="popular")
        <div key={category.id} id={category.id} className="mb-8 scroll-mt-4">
          
          {/* Section Header */}
          <div className="mb-4 flex items-end justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2">
            <div>
              <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">
                {category.name}
              </h2>
              <p className="text-[10px] text-gray-400">{category.subCategories.length} Items</p>
            </div>
          </div>

          {/* Grid Items */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-6">
            {category.subCategories.map((sub, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                {/* Image */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm mb-2 group-active:scale-95 transition-transform bg-gray-50">
                  <img 
                    src={sub.img} 
                    alt={sub.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                {/* Text */}
                <span className="text-[10px] text-center text-gray-600 font-medium leading-tight line-clamp-2 px-1">
                  {sub.name}
                </span>
              </div>
            ))}
          </div>

          {/* Optional Divider between sections */}
          <div className="h-px bg-gray-50 w-full mt-6"></div>

        </div>
      ))}

      {/* Bottom Spacer */}
      <div className="h-24"></div>
    </div>
  );
};

export default CategoryGrid;