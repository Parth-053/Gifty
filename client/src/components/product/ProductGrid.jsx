import React, { useEffect, useMemo } from 'react'; // Added useMemo
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTrendingProducts, fetchSuggestedProducts, fetchProducts } from '../../store/productSlice';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

const ProductGrid = ({ limit = 10, type = 'general', title, seeAllLink, mode = 'vertical', sort = 'newest' }) => {
  const dispatch = useDispatch();
  
  // 1. Select Data
  const { trendingList, suggestedList, list, loading } = useSelector((state) => state.products || {});

  // 2. Memoize 'products' to ensure stable reference across renders
  const products = useMemo(() => {
    // Determine which raw data source to use
    let rawData = [];
    if (type === 'trending') rawData = trendingList;
    else if (type === 'suggested') rawData = suggestedList;
    else rawData = list;

    // Extract the array from the raw data
    if (Array.isArray(rawData)) return rawData;
    if (rawData?.products) return rawData.products;
    if (rawData?.docs) return rawData.docs;
    return [];
  }, [type, trendingList, suggestedList, list]); // Re-run only if these change

  // 3. Effect: Fetch data ONLY if missing
  useEffect(() => {
    const hasData = products && products.length > 0;

    if (!hasData && !loading) {
      if (type === 'trending') {
         dispatch(fetchTrendingProducts({ limit }));
      } else if (type === 'suggested') {
         dispatch(fetchSuggestedProducts({ limit }));
      } else if (type === 'general') {
         dispatch(fetchProducts({ limit, sort }));
      }
    }
  }, [dispatch, type, limit, sort, products, loading]); 

  // Loading Skeleton
  if (loading && (!products || products.length === 0)) return (
    <div className="px-4 mt-8">
       {title && <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"/>}
       <div className={`grid gap-4 ${mode === 'horizontal' ? 'grid-flow-col auto-cols-[160px]' : 'grid-cols-2 md:grid-cols-4'}`}>
          {[...Array(limit)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
       </div>
    </div>
  );

  // Hide completely if no products found
  if (!products || products.length === 0) return null;

  // --- DYNAMIC ROW LOGIC ---
  const isSingleRow = products.length <= 5;
  const gridRowsClass = isSingleRow ? "grid-rows-1" : "grid-rows-2";

  return (
    <div className="mt-8 px-4">
      
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-gray-900">{title}</h2>
            {title.includes('Trending') && (
               <Sparkles size={16} className="text-yellow-500 fill-yellow-500 animate-pulse" />
            )}
          </div>
          {seeAllLink && (
            <Link to={seeAllLink} className="text-sm font-bold text-blue-600 hover:underline">
              See All
            </Link>
          )}
        </div>
      )}

      {/* Grid Content */}
      {mode === 'horizontal' ? (
        <div className={`
          grid grid-flow-col gap-4 overflow-x-auto pb-4 
          auto-cols-[160px] sm:auto-cols-[200px]
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
          ${gridRowsClass} 
        `}>
          {products.slice(0, limit).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, limit).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;