import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import { formatPrice, calculateDiscount } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isLiked = isInWishlist(product._id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const increment = () => setQuantity(prev => (prev < product.stock ? prev + 1 : prev));
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.category?.name || 'General'}
          </span>
          {discount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star fill="currentColor" size={18} />
            <span className="font-bold text-gray-900">{product.rating || 4.5}</span>
            <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
          </div>
          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-bold flex items-center gap-1">In Stock</span>
          ) : (
            <span className="text-red-600 text-sm font-bold">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
        <span className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
        {discount > 0 && (
          <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700">Quantity:</span>
          <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
            <button onClick={decrement} className="p-3 hover:bg-gray-100 rounded-l-xl transition-colors"><Minus size={16} /></button>
            <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
            <button onClick={increment} className="p-3 hover:bg-gray-100 rounded-r-xl transition-colors"><Plus size={16} /></button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => addToCart(product, quantity)}
            isLoading={cartLoading}
            disabled={product.stock === 0}
            size="lg" 
            fullWidth
            icon={ShoppingCart}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <button 
            onClick={() => toggleWishlist(product._id)}
            className={`
              p-4 rounded-xl border-2 transition-all flex-shrink-0
              ${isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-500'}
            `}
          >
            <Heart fill={isLiked ? "currentColor" : "none"} size={24} />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 pt-6">
        <FeatureItem icon={Truck} title="Free Delivery" subtitle="On orders over ₹999" />
        <FeatureItem icon={RotateCcw} title="Easy Returns" subtitle="7 Days Policy" />
        <FeatureItem icon={ShieldCheck} title="Secure Payment" subtitle="100% Protected" />
      </div>

      {/* Description */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="font-bold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, subtitle }) => (
  <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
    <Icon className="mx-auto text-blue-600 mb-2" size={24} />
    <p className="font-bold text-gray-900 text-xs">{title}</p>
    <p className="text-[10px] text-gray-500">{subtitle}</p>
  </div>
);

export default ProductInfo;