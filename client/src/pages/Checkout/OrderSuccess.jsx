import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, Package, ArrowRight, Home } from 'lucide-react';
// Note: If you don't have canvas-confetti, you can remove the import and the useEffect hook below
// import confetti from 'canvas-confetti'; 

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Security redirect: If accessed without an order ID, go home
    if (!orderId) {
      navigate('/');
    }
    
    // Optional: Trigger confetti animation if installed
    // if (typeof confetti === 'function') {
    //   confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    // }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-lg w-full">
        
        {/* Animated Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 animate-bounce">
          <Check size={48} className="text-white" strokeWidth={4} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Thank you for your purchase. Your order <span className="font-bold text-gray-900">#{orderId.slice(-8).toUpperCase()}</span> has been placed successfully.
        </p>

        {/* Info Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
          <p className="text-sm text-gray-600 mb-4">
            We've sent a confirmation email to your inbox. You can track your order status in your account.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <Package size={18} />
            Estimated Delivery: 3-5 Business Days
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={`/user/orders/${orderId}`} // Ensure this route exists in AppRoutes
            className="px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            View Order Details
          </Link>
          <Link 
            to="/"
            className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Home size={18} /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;