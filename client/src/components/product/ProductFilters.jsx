import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Filter } from 'lucide-react';
import Button from '../common/Button';
import { fetchCategories } from '../../store/categorySlice'; // Import Action

const ProductFilters = ({ isOpen, onClose, filters, setFilters }) => {
  const dispatch = useDispatch();
  
  // Real Data from Redux
  const { items: categories, loading } = useSelector((state) => state.categories);

  // Auto-fetch categories if empty
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? '' : catId
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 right-0 w-[300px] bg-white shadow-2xl z-50 p-6 
        transform transition-transform duration-300 ease-out overflow-y-auto
        lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:p-0 lg:block lg:h-auto lg:z-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter size={20} /> Filters
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Sort Option */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Sort By</h4>
            <select 
              value={filters.sort} 
              onChange={handleSortChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Categories (Fully Dynamic Now) */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Categories</h4>
            
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-6 bg-gray-100 rounded w-3/4"></div>)}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.category === ''}
                    onChange={() => setFilters(prev => ({...prev, category: ''}))}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors">All Categories</span>
                </label>
                
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={filters.category === cat._id}
                      onChange={() => handleCategoryChange(cat._id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Price Range</h4>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Mobile Footer Action */}
          <div className="lg:hidden pt-4 border-t border-gray-100">
            <Button fullWidth onClick={onClose}>
              Show Results
            </Button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default ProductFilters;