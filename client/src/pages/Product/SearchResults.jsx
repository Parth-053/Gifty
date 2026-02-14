import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch } from '../../store/searchSlice';
import { ShoppingCart, ArrowLeft, Search, Filter, ArrowUpDown, Loader2 } from 'lucide-react';
import ProductFilters from '../../components/product/ProductFilters'; // Filter Component

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { results, loading, totalResults } = useSelector((state) => state.search);
  const { totalItems } = useSelector((state) => state.cart); 

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (query) {
      dispatch(performSearch({ query }));
    }
  }, [query, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
      {/* --- 1. Header (Back | Search Input | Cart) --- */}
      {/* THEME APPLIED: Gradient Background */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
        <div className="flex items-center gap-3 p-3">
          {/* Back Button - Now White */}
          <button onClick={() => navigate(-1)} className="text-white p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>

          {/* Search Input (Fake) - White background for contrast */}
          <div 
            onClick={() => navigate('/search')}
            className="flex-1 bg-white h-10 rounded-lg flex items-center px-3 gap-2 cursor-pointer border-none shadow-inner"
          >
            <Search size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-900 truncate">{query}</span>
          </div>

          {/* Cart Button - Now White */}
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-yellow-400 text-purple-900 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* --- 2. Filter & Sort Bar --- */}
        {/* Kept white for standard UI separation, but using theme color for text highlights if needed */}
        <div className="grid grid-cols-2 bg-white divide-x divide-gray-100 border-b border-gray-100 shadow-sm">
          <button 
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-700 active:bg-gray-50 hover:bg-gray-50 transition-colors"
            onClick={() => {/* Implement Sort Logic */}}
          >
            <ArrowUpDown size={16} className="text-gray-500" /> Sort
          </button>
          <button 
            className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-700 active:bg-gray-50 hover:bg-gray-50 transition-colors"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={16} className="text-gray-500" /> Filter
          </button>
        </div>
      </div>

      {/* --- 3. Results Body --- */}
      <div className="flex-1 p-2">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin text-purple-600 mb-2" size={32} />
            <p className="text-sm text-gray-500 font-medium">Searching...</p>
          </div>
        ) : results && results.length > 0 ? (
          <>
            <p className="text-xs text-gray-500 mb-2 px-2 font-medium mt-2">
              {totalResults} results found for "{query}"
            </p>
            
            <div className="grid grid-cols-2 gap-2">
                {results.map(product => (
                    <div 
                      key={product._id} 
                      onClick={() => navigate(`/product/${product._id}`)} 
                      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
                    >
                        <div className="aspect-square w-full bg-gray-50 rounded-lg mb-2 overflow-hidden">
                          <img src={product.images?.[0]?.url} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} />
                        </div>
                        <p className="font-bold text-sm text-gray-900 truncate mb-0.5">{product.name}</p>
                        <p className="text-xs text-gray-500 mb-1.5">{product.brand || "Brand"}</p>
                        <div className="flex gap-2 items-baseline">
                            <span className="font-bold text-gray-900">₹{product.price}</span>
                            {product.discount > 0 && (
                              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">{product.discount}% off</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No results found</h3>
            <p className="text-gray-500 text-sm mt-1">
              We couldn't find matches for "{query}". <br/> Check spelling or try different keywords.
            </p>
            {/* THEME APPLIED: Gradient Button */}
            <button 
              onClick={() => navigate('/search')}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 active:scale-95 transition-transform"
            >
              Search Again
            </button>
          </div>
        )}
      </div>

      {/* --- 4. Filter Modal --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end isolate">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFilterOpen(false)} />
          
          {/* Filter Sidebar */}
          <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col animate-slide-in">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-gray-900">
                  Close
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                <ProductFilters /> 
             </div>

             <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                {/* THEME APPLIED: Gradient Button */}
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 text-white font-bold bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Apply
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;