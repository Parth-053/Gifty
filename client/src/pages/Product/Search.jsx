import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import SearchHeader from '../../components/search/SearchHeader';
import ProductGrid from '../../components/product/ProductGrid';
import NoResults from '../../components/search/NoResults';
import ProductFilters from '../../components/product/ProductFilters'; // Optional: Reuse mobile filters
import Loader from '../../components/common/Loader';

// Actions
import { fetchProducts } from '../../store/productSlice';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // 'q' matches standard search param
  
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  
  const [sort, setSort] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch on mount or query change
  useEffect(() => {
    if (query) {
      dispatch(fetchProducts({ search: query, sort }));
    }
  }, [dispatch, query, sort]);

  const handleClear = () => {
    setSearchParams({}); // Clear URL params
  };

  if (loading) return <Loader fullScreen />;

  if (!query) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Search for something</h2>
        <p className="text-gray-500">Type in the search bar above to find products.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      
      {/* 1. Header & Controls */}
      <SearchHeader 
        resultsCount={products.length}
        searchQuery={query}
        onClearSearch={handleClear}
        onToggleFilters={() => setIsFilterOpen(true)}
        sortValue={sort}
        onSortChange={setSort}
      />

      {/* 2. Results Grid or Empty State */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <NoResults query={query} onReset={handleClear} />
      )}

      {/* 3. Mobile Filter Drawer (Optional Re-use) */}
      <ProductFilters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={{ sort }} // Pass simplified filters for now
        setFilters={(newFilters) => setSort(newFilters.sort)} // Only sync sort for simplicity here
      />
    </div>
  );
};

export default Search;