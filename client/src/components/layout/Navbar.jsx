import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, Heart } from 'lucide-react';

const Navbar = () => {
  const { totalQty } = useSelector((state) => state.cart);
  const { items } = useSelector((state) => state.wishlist);

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 to-indigo-600">
      
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 1. Logo - Pure White Text on Gradient Background */}
        <Link 
          to="/" 
          className="group flex flex-col justify-center"
        >
          <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-md">
            GIFTY
          </span>
        </Link>

        {/* 2. Icons - White Glassy Buttons */}
        <div className="flex items-center gap-3">
          
          {/* ❤️ Wishlist Button */}
          <Link 
            to="/wishlist" 
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 border border-white/10 shadow-sm active:scale-95"
          >
            <Heart 
              size={20} 
              className="text-white group-hover:fill-white/30 transition-colors duration-300" 
              strokeWidth={2.5}
            />
            {items?.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-bold items-center justify-center ring-2 ring-white">
                  {items.length}
                </span>
              </span>
            )}
          </Link>

          {/* 🛍️ Cart Button */}
          <Link 
            to="/cart" 
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 border border-white/10 shadow-sm active:scale-95"
          >
            <ShoppingBag 
              size={20} 
              className="text-white transition-colors duration-300" 
              strokeWidth={2.5}
            />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 text-white text-[9px] font-bold items-center justify-center ring-2 ring-white">
                  {totalQty}
                </span>
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;