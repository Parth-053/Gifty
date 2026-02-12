import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../store/categorySlice';
import { Package } from 'lucide-react';

const CategoryRail = () => {
  const dispatch = useDispatch();
  
  // Safety check for state
  const { items, loading } = useSelector((state) => state.categories || {});
  const categories = items || []; 

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Loading Skeleton
  if (loading && categories.length === 0) {
    return (
      <div className="py-4 px-4">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hide component completely if no categories
  if (!categories || categories.length === 0) return null;

  return (
    <div className="py-6">
      <div className="px-4 mb-4">
        {/* Removed "See All" button, only Title remains */}
        <h3 className="font-bold text-gray-900 text-lg">Shop by Category</h3>
      </div>
      
      {/* Horizontal Scroll - Scrollbar Hidden */}
      <div className="flex gap-5 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {categories.map((cat) => (
          <Link 
            key={cat._id} 
            to={`/shop?category=${cat._id}`}
            className="flex flex-col items-center gap-2 min-w-[72px] group cursor-pointer"
          >
            {/* Theme Colored Gradient Border */}
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-purple-600 shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
              <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden">
                {cat.image?.url ? (
                  <img 
                    src={cat.image.url} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <Package size={20} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>
            
            <span className="text-xs font-bold text-gray-700 text-center truncate w-full px-1 group-hover:text-blue-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryRail;