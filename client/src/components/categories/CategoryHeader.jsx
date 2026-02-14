import React from 'react';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategoryHeader = () => {
  const navigate = useNavigate();
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 border-b border-purple-500 shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        
        {/* Left: Title (Back button removed) */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white tracking-wide">All Categories</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/search')} 
            className="text-white hover:text-purple-200 transition-colors"
          >
            <Search size={22} />
          </button>
          
          <button 
            onClick={() => navigate('/wishlist')} 
            className="text-white hover:text-purple-200 transition-colors"
          >
            <Heart size={22} />
          </button>

          <button 
            onClick={() => navigate('/cart')} 
            className="relative text-white hover:text-purple-200 transition-colors"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;