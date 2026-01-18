import React from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Use separate hook
import { useCart } from '../../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  
  // ✅ Get data from useCart hook
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();

  const discount = cartItems.length > 0 ? 50 : 0; // Fake discount logic
  const finalTotal = cartTotal - discount;

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-32">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Shopping Cart <span className="text-gray-400 text-sm">({cartItems.length})</span></h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="p-4 animate-fade-in">
           {/* Items List */}
           {cartItems.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 mb-3 flex gap-3 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <h3 className="text-xs font-bold text-gray-800 line-clamp-2 w-[85%]">{item.name}</h3>
                     <button onClick={() => removeFromCart(item.id)} className="text-gray-400"><Trash2 size={16} /></button>
                  </div>
                  {/* Show Custom Text if available from Customize Page */}
                  {item.options?.customText && (
                    <p className="text-[10px] text-gray-500 bg-gray-50 inline-block px-1 rounded w-fit">✎ "{item.options.customText}"</p>
                  )}
                  <div className="flex justify-between items-end mt-1">
                     <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
                     <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                        <button onClick={() => updateQty(item.id, 'dec')} className="text-gray-500"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-3 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 'inc')} className="text-gray-800"><Plus size={14} /></button>
                     </div>
                  </div>
                </div>
              </div>
           ))}

           {/* Bill Details */}
           <div className="bg-white p-4 rounded-xl border border-gray-100 mt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bill Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Item Total</span><span>₹{cartTotal}</span></div>
                <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{discount}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">FREE</span></div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between font-bold text-base text-gray-900"><span>To Pay</span><span>₹{finalTotal}</span></div>
              </div>
           </div>
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center pt-32 opacity-50">
            <ShoppingBag size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-500 text-sm">Cart is empty</p>
         </div>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-30">
           <button 
             onClick={() => navigate('/checkout/address')}
             className="w-full bg-[#FF6B6B] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#FF6B6B]/30 active:scale-95 transition-transform"
           >
              Proceed to Pay ₹{finalTotal}
           </button>
        </div>
      )}
    </div>
  );
};

export default Cart;