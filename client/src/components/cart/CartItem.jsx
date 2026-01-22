import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);

  // Handle Quantity Change with Debounce/Loading state
  const handleQuantity = async (newQty) => {
    if (newQty < 1 || newQty > item.product.stock) return;
    setUpdating(true);
    await updateQuantity(item._id, newQty);
    setUpdating(false);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100 last:border-0">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        <img 
          src={item.product.images?.[0]?.url} 
          alt={item.product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <Link 
              to={`/product/${item.product._id}`} 
              className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors"
            >
              {item.product.name}
            </Link>
            <button 
              onClick={() => removeFromCart(item._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            {item.variant ? `Variant: ${item.variant}` : 'Standard'}
          </p>
        </div>

        {/* Price & Quantity Controls */}
        <div className="flex justify-between items-end mt-2">
          <p className="font-black text-lg text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </p>

          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-9">
            <button 
              onClick={() => handleQuantity(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            
            <span className="w-8 text-center text-sm font-bold flex items-center justify-center">
              {updating ? <Loader2 size={12} className="animate-spin" /> : item.quantity}
            </span>
            
            <button 
              onClick={() => handleQuantity(item.quantity + 1)}
              disabled={updating || item.quantity >= item.product.stock}
              className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;