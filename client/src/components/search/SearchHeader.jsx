import React from 'react';
import { Filter, X } from 'lucide-react';

const SearchHeader = ({ 
  resultsCount, 
  searchQuery, 
  onClearSearch, 
  onToggleFilters, 
  sortValue, 
  onSortChange 
}) => {
  if (!searchQuery) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      
      {/* Left: Result Text */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Results for <span className="text-blue-600">"{searchQuery}"</span>
          <button 
            onClick={onClearSearch}
            className="p-1 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Found {resultsCount} {resultsCount === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        {/* Filter Toggle (Mobile) */}
        <button 
          onClick={onToggleFilters}
          className="lg:hidden p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
        >
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;