import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

// Components
import TopHeader from '../../components/home/TopHeader';
import HeroBanner from '../../components/home/HeroBanner';
import CategoryRail from '../../components/home/CategoryRail';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';

// Actions
import { fetchProducts } from '../../store/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  // Fetch "New Arrivals" (Limit 8)
  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: 'newest' }));
  }, [dispatch]);

  return (
    <div className="pb-24 md:pb-8 px-4 max-w-7xl mx-auto pt-4">
      <TopHeader />
      <HeroBanner />
      <CategoryRail />

      <div className="mt-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Sparkles className="text-yellow-500" size={20} />
           <h2 className="text-xl font-black text-gray-900">New Arrivals</h2>
        </div>
        {/* Note: This links to Categories page now effectively as main shop */}
        <Link 
          to="/categories" 
          className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {loading && products.length === 0 ? (
         <div className="min-h-[300px] flex items-center justify-center"><Loader /></div>
      ) : (
         <ProductGrid products={products} />
      )}

      {/* Promo Banner */}
      <div className="mt-12 relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 md:p-12 text-center md:text-left shadow-2xl">
        <div className="relative z-10 max-w-lg">
           <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">AI Powered</span>
           <h2 className="text-3xl md:text-4xl font-black mb-4">Create Unique Gifts</h2>
           <p className="text-gray-300 mb-8 leading-relaxed">Design your own personalized products using our AI tool. It's magic!</p>
           <Link 
             to="/customize" 
             className="inline-block bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
           >
             Start Creating
           </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl -ml-12 -mb-12" />
      </div>
    </div>
  );
};

export default Home;