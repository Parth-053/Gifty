import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

const ProductGrid = ({ products, loading }) => {
  
  if (loading) {
    // Skeleton Loader
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4 animate-pulse">
            <div className="bg-gray-200 aspect-[4/5] rounded-xl w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <PackageX size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No products found</h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-2">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;