import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories } from '../../store/categorySlice';
import { ChevronRight, Layers, Loader2 } from 'lucide-react';

const CategorySidebar = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: categories, loading } = useSelector((state) => state.categories);
  
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleSelect = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (activeCategory === categoryId) {
      newParams.delete('category'); // Toggle off
    } else {
      newParams.set('category', categoryId);
      newParams.set('page', 1); // Reset to page 1
    }
    
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Layers size={20} className="text-blue-600" />
        Categories
      </h3>

      {loading && categories.length === 0 ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-gray-400" size={20} />
        </div>
      ) : (
        <ul className="space-y-1">
          {/* "All" Option */}
          <li>
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !activeCategory 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>All Products</span>
              {!activeCategory && <ChevronRight size={16} />}
            </button>
          </li>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => handleSelect(cat._id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat._id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Optional: Small Icon if available */}
                  {cat.image?.url && (
                    <img src={cat.image.url} alt="" className="w-5 h-5 rounded-md object-cover" />
                  )}
                  <span>{cat.name}</span>
                </div>
                {activeCategory === cat._id && <ChevronRight size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategorySidebar;