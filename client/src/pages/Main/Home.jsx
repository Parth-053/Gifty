import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
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
      
      {/* --- LOCATION BAR (UPDATED) --- */}
      <div 
        onClick={() => navigate('/user/addresses')}
        className="bg-[#2e1065] text-white text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#311a7f] transition-colors"
      >
        <MapPin size={14} className="text-purple-300" />
        <span className="font-medium text-purple-200">Deliver to:</span>
        <span className="font-bold truncate">Select Location</span>
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
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </form>
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <CategoryRail />

      {/* --- TRENDING SECTION --- */}
      <ProductGrid 
        type="trending" 
        title="Trending Now" 
        seeAllLink="/trending" 
        limit={12} 
        mode="horizontal" 
      />

      {/* --- SUGGESTED SECTION --- */}
      <ProductGrid 
        type="suggested" 
        title="Suggested for You" 
        limit={8} 
        mode="vertical" 
      />

      <Footer />
    </div>
  );
};

export default Home;