import React from 'react';
import { ShoppingBag, Heart, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

// ✅ Import Separate Hooks
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const StatsBar = () => {
  // ✅ Get data from individual hooks
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const stats = [
    { 
      label: 'Cart', 
      value: cartCount, // Live count from CartContext
      icon: ShoppingBag, 
      link: '/cart' 
    },
    { 
      label: 'Wishlist', 
      value: wishlistItems.length, // Live count from WishlistContext
      icon: Heart, 
      link: '/wishlist' 
    },
    { 
      label: 'Coupons', 
      value: '3', // Dummy Data (Static)
      icon: Ticket, 
      link: '/account/coupons' 
    },
  ];

  return (
    <div className="px-4 -mt-6 mb-6 relative z-10">
      <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-4 flex justify-between items-center border border-gray-50">
        
        {stats.map((stat, index) => (
          <Link to={stat.link} key={index} className="flex-1 flex flex-col items-center gap-1 active:scale-95 transition-transform group">
            <div className="text-[#FF6B6B] bg-[#FF6B6B]/10 p-2.5 rounded-full mb-1 group-hover:bg-[#FF6B6B] group-hover:text-white transition-colors">
               <stat.icon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-extrabold text-gray-800">{stat.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default StatsBar;