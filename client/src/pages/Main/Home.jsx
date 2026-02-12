import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../../components/home/HeroBanner';
import CategoryRail from '../../components/home/CategoryRail';
import ProductGrid from '../../components/product/ProductGrid';
import Footer from '../../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Location Bar */}
      <div className="bg-gray-900 text-white text-xs py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate max-w-[80%]">
          <MapPin size={12} className="text-blue-400" />
          <span className="font-medium text-gray-300">Deliver to:</span>
          <span className="font-bold truncate">Select Location</span>
        </div>
        <button className="text-blue-400 font-bold hover:underline">Change</button>
      </div>

      {/* Search Bar */}
      <div className="sticky top-16 z-40 bg-white px-4 py-3 shadow-sm border-b border-gray-100">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for gifts, brands and more..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </form>
      </div>

      <HeroBanner />
      <CategoryRail />

      {/* --- TRENDING (Uses 'trendingList' in Redux) --- */}
      <ProductGrid 
        type="trending" // <--- IMPORTANT
        title="Trending Now" 
        seeAllLink="/trending" 
        limit={12} 
        mode="horizontal" 
      />

      {/* --- SUGGESTED (Uses 'suggestedList' in Redux) --- */}
      <ProductGrid 
        type="suggested" // <--- IMPORTANT
        title="Suggested for You" 
        limit={8} 
        mode="vertical" 
      />

      <Footer />
    </div>
  );
};

export default Home;