import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  // 1. Safety Check: If no product data, return nothing
  if (!product) return null;

  // 2. Destructure & Defaults
  const { 
    _id, 
    name, 
    price, 
    originalPrice, // Assuming you have an MRP/Original Price field
    images, 
    category, 
    rating = 0, 
    stock = 0 
  } = product;

  // 3. Calculate Discount Percentage
  let discountPercentage = 0;
  if (originalPrice && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  // 4. Image Logic (Fallback if no image)
  const imageUrl = images?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image';

  return (
    <Link 
      to={`/product/${_id}`} 
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge: Low Stock */}
        {stock > 0 && stock <= 5 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            Low Stock
          </span>
        )}

        {/* Badge: Discount % */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="p-3">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {category?.name || 'Gift'}
          </span>
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-bold text-gray-700">{rating}</span>
            </div>
          )}
        </div>

        {/* Title: Truncated to Single Line */}
        <h3 className="text-sm font-bold text-gray-900 truncate mb-1" title={name}>
          {name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-2">
          {/* Selling Price */}
          <span className="text-lg font-black text-gray-900">
            ₹{price?.toLocaleString()}
          </span>

          {/* Original Price (Strikethrough) */}
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;