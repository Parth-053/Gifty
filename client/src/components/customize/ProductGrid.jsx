import React from 'react';

const ProductGrid = ({ products, onSelect, prompt }) => {
  return (
    <div>
      <h2 className="font-bold text-gray-800 mb-4 text-sm">
        {prompt ? "AI Recommendations For You" : "Popular Canvases"}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            onClick={() => onSelect(product)}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="h-32 bg-gray-50 rounded-lg mb-3 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-[#FF6B6B] font-bold mt-1">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;