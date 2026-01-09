import React from 'react';
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Use separate hooks instead of useShop
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const Wishlist = () => {
  const navigate = useNavigate();
  
  // ✅ Get data from hooks
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    toggleWishlist(item); // Optional: Remove from wishlist after adding
    alert("Moved to Cart!");
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">My Wishlist <span className="text-gray-400 text-sm">({wishlistItems.length})</span></h1>
      </div>

      {/* List */}
      <div className="p-4 space-y-3">
        {wishlistItems.length > 0 ? (
          wishlistItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 shadow-sm animate-fade-in">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                  <p className="text-sm font-bold text-[#FF6B6B] mt-1">₹{item.price}</p>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between items-center mt-2">
                   <button 
                     onClick={() => toggleWishlist(item)} 
                     className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1"
                   >
                     <Trash2 size={14} /> Remove
                   </button>
                   <button 
                     onClick={() => handleMoveToCart(item)}
                     className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                   >
                     <ShoppingBag size={12} /> Move to Cart
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-32 opacity-50">
            <Heart size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;