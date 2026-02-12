import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { fetchWishlist } from '../../store/wishlistSlice';
import ProductCard from '../../components/product/ProductCard'; 

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist || { items: [] });

  // Ensure fresh data
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- THEMED HEADER --- */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          My Wishlist
        </h1>

        <div className="w-8" /> 
      </div>

      {/* --- CONTENT --- */}
      <div className="p-4">
        {items.length === 0 && !loading ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Heart size={32} className="text-pink-500 fill-pink-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Empty Wishlist</h2>
            <p className="text-gray-500 max-w-xs mb-8">
              You haven't saved any items yet. Start exploring to find the perfect gift!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all active:scale-95"
            >
              Explore Gifts
            </button>
          </div>
        ) : (
          // Wishlist Grid
          <>
            <div className="flex items-center gap-2 mb-4 px-1">
               <Sparkles size={16} className="text-purple-600" />
               <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                 {items.length} Items Saved
               </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;