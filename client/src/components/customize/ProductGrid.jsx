import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ProductGrid = ({ products, selectedProduct, onSelect }) => {
  if (!products?.length) return null;

  return (
    <div className="bg-white p-4 border-b border-gray-100">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">1. Select Base Product</p>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <button
            key={product._id}
            onClick={() => onSelect(product)}
            className={`
              relative flex-shrink-0 w-24 flex flex-col items-center gap-2 group transition-all
              ${selectedProduct?._id === product._id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
            `}
          >
            <div className={`
              w-20 h-20 rounded-2xl border-2 overflow-hidden relative transition-all
              ${selectedProduct?._id === product._id 
                ? 'border-blue-600 ring-2 ring-blue-100 scale-105' 
                : 'border-gray-200 group-hover:border-gray-300'
              }
            `}>
              <img 
                src={product.images?.[0]?.url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {selectedProduct?._id === product._id && (
                <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-blue-600 bg-white rounded-full" fill="white" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-700 text-center leading-tight truncate w-full px-1">
              {product.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;