import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { removeFromCart, updateQuantity, fetchCart } from '../../store/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount, loading } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });

  // Ensure fresh data on load
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      
      {/* --- THEMED HEADER --- */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
          Shopping Cart
        </h1>
        <div className="w-8" />
      </div>

      {/* --- CONTENT --- */}
      <div className="p-4">
        {items.length === 0 && !loading ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-purple-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 max-w-xs mb-8">
              Looks like you haven't added anything yet. Explore our unique gifts!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // Cart Items List
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-fadeIn">
                
                {/* Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  <img 
                    src={item.images?.[0]?.url || item.image} // Handle different API structures
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-purple-600 font-medium">{item.variant || 'Standard Gift'}</p>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-lg text-gray-900">₹{item.price?.toLocaleString()}</span>
                    
                    {/* Qty Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                       <button 
                         onClick={() => dispatch(updateQuantity({ id: item._id, qty: item.quantity - 1 }))} 
                         disabled={item.quantity <= 1}
                         className="w-6 h-6 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-white rounded transition-colors"
                       >
                         <Minus size={14} strokeWidth={3} />
                       </button>
                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                       <button 
                         onClick={() => dispatch(updateQuantity({ id: item._id, qty: item.quantity + 1 }))} 
                         className="w-6 h-6 flex items-center justify-center text-gray-900 hover:bg-white rounded transition-colors"
                       >
                         <Plus size={14} strokeWidth={3} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CHECKOUT BAR --- */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 safe-area-pb z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-2xl font-black text-gray-900">₹{totalAmount?.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:opacity-90 transition-all active:scale-95"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;