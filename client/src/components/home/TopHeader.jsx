import React from 'react';
import { ShoppingCart, Heart, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Import Hooks for Real Data
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const TopHeader = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // ✅ Real Cart Count
  const { wishlistItems } = useWishlist(); // ✅ Real Wishlist Count

  return (
    <div className="bg-white sticky top-0 z-40 shadow-sm pb-2">
      {/* 1. Logo & Actions Row */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Brand */}
        <h1 className="text-2xl font-extrabold text-[#FF6B6B] tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
          Gifty.
        </h1>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          
          {/* Wishlist Icon */}
          <button onClick={() => navigate('/wishlist')} className="relative active:scale-95 transition-transform">
             <Heart size={24} className="text-gray-600" />
             {wishlistItems.length > 0 && (
               <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                 {wishlistItems.length}
               </span>
             )}
          </button>

          {/* Cart Icon */}
          <button onClick={() => navigate('/cart')} className="relative active:scale-95 transition-transform">
            <ShoppingCart size={24} className="text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Location Bar (Mini) */}
      <div className="px-4 flex items-center gap-1 text-xs text-gray-500 mb-3" onClick={() => navigate('/account/addresses')}>
        <MapPin size={12} className="text-[#FF6B6B]" />
        <span>Deliver to: </span>
        <span className="font-bold text-gray-800">Mumbai, 400001</span>
        <span className="text-[10px]">▼</span>
      </div>

      {/* 3. Search Bar */}
      <div className="px-4">
        <div 
          onClick={() => navigate('/search')} // ✅ Redirect to Search Page on click
          className="flex items-center bg-gray-100 rounded-xl px-3 py-2.5 shadow-inner cursor-text"
        >
          <Search size={18} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">Search for gifts, occasions...</span>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;