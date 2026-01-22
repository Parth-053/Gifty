import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../store/categorySlice';
import { Package, ArrowRight } from 'lucide-react';

const CategoryRail = () => {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector((state) => state.categories);

  // Fetch only if empty
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Loading Skeleton
  if (loading && categories.length === 0) {
    return (
      <div className="py-4">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hide if no categories
  if (categories.length === 0) return null;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-1 mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Shop by Category</h3>
        <Link to="/categories" className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
          See All <ArrowRight size={14} />
        </Link>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {categories.map((cat) => (
          <Link 
            key={cat._id} 
            to={`/shop?category=${cat._id}`}
            className="flex flex-col items-center gap-2 min-w-[72px] snap-start group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all transform group-hover:scale-105">
              {/* Image Logic: Database URL -> Fallback Icon */}
              {cat.image?.url ? (
                <img 
                  src={cat.image.url} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-white">
                  <Package size={24} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center truncate w-full px-1 group-hover:text-blue-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryRail;