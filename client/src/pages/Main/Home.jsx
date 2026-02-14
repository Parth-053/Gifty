import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Added Redux hooks
import { fetchAddresses } from '../../store/addressSlice'; // Added fetch action

// Components
import HeroBanner from '../../components/home/HeroBanner';
import CategoryRail from '../../components/home/CategoryRail';
import ProductGrid from '../../components/product/ProductGrid';
import Footer from '../../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. Get User & Address Data ---
  const { user } = useSelector((state) => state.auth);
  const { items: addresses, selectedId } = useSelector((state) => state.addresses);

  // --- 2. Fetch Addresses on Mount ---
  useEffect(() => {
    if (user) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, user]);

  // --- 3. Determine Active Address ---
  // Logic: User Selection > Default > First Available
  const activeAddress = addresses.find(addr => addr._id === selectedId) 
                        || addresses.find(addr => addr.isDefault) 
                        || addresses[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- LOCATION BAR (NOW CONNECTED TO REDUX) --- */}
      <div 
        onClick={() => navigate('/user/addresses')}
        className="bg-[#2e1065] text-white text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#311a7f] transition-colors"
      >
        <MapPin size={14} className="text-purple-300 shrink-0" />
        <span className="font-medium text-purple-200 shrink-0">Deliver to:</span>
        
        {/* Dynamic Address Display */}
        <span className="font-bold truncate max-w-[250px] sm:max-w-md">
          {activeAddress ? (
            <>
              <span className="uppercase text-yellow-300 mr-1">
                {activeAddress.type || "HOME"}
              </span> 
              - {activeAddress.addressLine1 ? activeAddress.addressLine1 : activeAddress.city} 
              {activeAddress.pincode ? `, ${activeAddress.pincode}` : ''}
            </>
          ) : (
            "Select Location"
          )}
        </span>
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