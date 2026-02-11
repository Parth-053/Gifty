import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product._id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      
      {/* 1. Image Section */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.images[0]?.url} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Action Buttons (Desktop Overlay) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isLiked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          {/* Quick View Button (Optional future feature) */}
          <button className="p-2 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full shadow-lg transition-colors md:flex hidden">
            <Eye size={18} />
          </button>
        </div>

        {/* Mobile Wishlist Button (Always Visible) */}
        <button 
          onClick={handleWishlist}
          className="md:hidden absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 shadow-sm"
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
        </button>
      </Link>

      {/* 2. Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-gray-500 font-medium">{product.category?.name || "Category"}</p>
          <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold">
          <Star size={10} fill="currentColor" />
          {/* Extract the 'average' property from the rating object */}
          <span>{product.rating?.average || 4.5}</span>
        </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`} className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-auto">
          {product.name}
        </Link>

        {/* Price & Cart Action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;