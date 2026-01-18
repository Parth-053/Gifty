import React, { useEffect } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Use separate hook
import { useCart } from '../../hooks/useCart';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart(); 

  // Page load hote hi Cart saaf karo
  useEffect(() => {
    clearCart(); 
  }, []);

  const orderId = Math.floor(100000 + Math.random() * 900000); 

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Animation / Icon */}
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
         <CheckCircle size={48} className="text-green-500" />
      </div>

      {/* Text */}
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Your order <span className="font-bold text-gray-800">#{orderId}</span> has been successfully placed. You will receive a confirmation email shortly.
      </p>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button 
          onClick={() => navigate('/account/orders')}
          className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Track Order <ArrowRight size={18} />
        </button>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-gray-50 text-gray-600 py-3.5 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Continue Shopping
        </button>
      </div>

    </div>
  );
};

export default OrderSuccess;