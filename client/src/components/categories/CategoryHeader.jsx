import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const CategoryHeader = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const { items: categories } = useSelector((state) => state.categories);

  // Find the active category details from the Redux store
  const activeCategory = useMemo(() => 
    categories.find(c => c._id === categoryId), 
  [categories, categoryId]);

  // If no category is selected or category not found, show nothing (or a generic shop header)
  if (!categoryId || !activeCategory) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 bg-gray-900 h-48 sm:h-64 flex items-center shadow-lg">
      {/* Background Image with Blur */}
      {activeCategory.image?.url && (
        <>
          <img 
            src={activeCategory.image.url} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </>
      )}
      
      <div className="relative z-10 px-8 sm:px-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block py-1 px-3 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
            Collection
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
          {activeCategory.name}
        </h1>
        
        <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
          {activeCategory.description || `Discover our exclusive collection of ${activeCategory.name}. Quality products curated just for you.`}
        </p>
      </div>
    </div>
  );
};

export default CategoryHeader;