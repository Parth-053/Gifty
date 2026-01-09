import React from 'react';
import { Heart, Star, Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden relative group">
      
      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-[#4ECDC4] text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
          {product.discount}% OFF
        </span>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm z-10">
        <Heart size={14} className="text-gray-500 hover:text-[#FF6B6B]" />
      </button>

      {/* Image */}
      <div className="h-36 w-full bg-gray-100 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="bg-green-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 font-bold text-green-700">
            {product.rating} <Star size={8} fill="currentColor" />
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          </div>
          
          <button className="bg-[#FF6B6B] text-white p-1.5 rounded-lg shadow-md active:scale-95 transition-transform">
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;