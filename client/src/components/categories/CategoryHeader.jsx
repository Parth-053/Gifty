import React from 'react';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Import Hooks
import { useCart } from '../../hooks/useCart';

const CategoryHeader = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // ✅ Real Cart Count

  return (
    <div className="px-4 py-3 border-b flex justify-between items-center sticky top-0 bg-white z-20 shadow-sm">
      <h1 className="text-lg font-bold text-gray-800">Categories</h1>
      
      <div className="flex gap-4">
        {/* Search */}
        <button onClick={() => navigate('/search')} className="text-gray-600 active:scale-90 transition-transform">
           <Search size={22} />
        </button>

        {/* Wishlist */}
        <button onClick={() => navigate('/wishlist')} className="text-gray-600 active:scale-90 transition-transform">
           <Heart size={22} />
        </button>

        {/* Cart */}
        <button onClick={() => navigate('/cart')} className="relative text-gray-600 active:scale-90 transition-transform">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B6B] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm border border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;