import React, { useState } from 'react';
import { Star, Minus, Plus, Heart, Share2, Truck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductInfo = ({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  // Handle Qty Change
  const handleQty = (type) => {
    if (type === 'inc') setQty(qty + 1);
    else setQty(Math.max(1, qty - 1));
  };

  return (
    <div className="space-y-4">
      {/* Title & Rating */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1">
            {product.rating} <Star size={10} className="fill-current" />
          </div>
          <span className="text-xs text-gray-500">({product.reviews} Reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
        <span className="text-sm text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
        <span className="text-sm font-bold text-[#FF6B6B] mb-1">({product.discount}% OFF)</span>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
           <Truck size={16} /> Free Delivery
        </div>
        <div className="bg-purple-50 text-purple-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
           <ShieldCheck size={16} /> 1 Year Warranty
        </div>
      </div>

      {/* Description */}
      <div>
         <h3 className="text-sm font-bold text-gray-800 mb-1">Description</h3>
         <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
      </div>

      {/* Action Buttons (Sticky Bottom Logic handled in Parent, here is static for Desktop) */}
      <div className="pt-4 pb-24">
         
         {/* Quantity & Wishlist Row */}
         <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg">
               <button onClick={() => handleQty('dec')} className="p-3 text-gray-600"><Minus size={16} /></button>
               <span className="font-bold w-6 text-center">{qty}</span>
               <button onClick={() => handleQty('inc')} className="p-3 text-gray-600"><Plus size={16} /></button>
            </div>
            
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`p-3 rounded-full border ${isInWishlist ? 'bg-red-50 border-red-200 text-[#FF6B6B]' : 'border-gray-200 text-gray-400'}`}
            >
               <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
            </button>
            
            <button className="p-3 rounded-full border border-gray-200 text-gray-400">
               <Share2 size={20} />
            </button>
         </div>

         {/* Main CTA Buttons */}
         <div className="grid grid-cols-2 gap-3">
            <button 
               onClick={() => onAddToCart(product, qty)}
               className="bg-white border-2 border-gray-900 text-gray-900 py-3.5 rounded-xl font-bold active:scale-95 transition-transform"
            >
               Add to Cart
            </button>
            <button 
               onClick={() => navigate(`/customize?productId=${product.id}`)}
               className="bg-[#FF6B6B] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#FF6B6B]/30 active:scale-95 transition-transform"
            >
               Customize Now
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProductInfo;