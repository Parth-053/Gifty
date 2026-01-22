import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
        <ShoppingBag size={40} fill="currentColor" className="opacity-20" />
        <ShoppingBag size={40} className="absolute" />
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Looks like you haven't added anything to your cart yet. Explore our products and find something unique!
      </p>
      
      <Link 
        to="/shop" 
        className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1 flex items-center gap-2"
      >
        Start Shopping <ArrowRight size={18} />
      </Link>
    </div>
  );
};

export default EmptyCart;