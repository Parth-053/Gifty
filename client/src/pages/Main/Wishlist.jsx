import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';
import { fetchWishlist } from '../../store/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const products = items.map(item => item.product || item); 

  if (loading) return <Loader fullScreen />;

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-6">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Empty Wishlist</h2>
        <p className="text-gray-500 max-w-sm mb-8">You haven't saved any items yet.</p>
        <Link to="/categories" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Heart className="text-pink-600 fill-pink-600" /> My Wishlist
          </h1>
          <p className="text-gray-500 mt-2">{items.length} items saved</p>
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

export default Wishlist;