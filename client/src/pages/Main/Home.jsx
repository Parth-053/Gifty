import React, { useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../../store/addressSlice';

// Components
import HeroBanner from '../../components/home/HeroBanner';
import CategoryRail from '../../components/home/CategoryRail';
import ProductGrid from '../../components/product/ProductGrid';
import Footer from '../../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const activeAddress = addresses.find(addr => addr._id === selectedId) 
                        || addresses.find(addr => addr.isDefault) 
                        || addresses[0];

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- LOCATION BAR --- */}
      <div 
        onClick={() => navigate('/user/addresses')}
        className="bg-[#2e1065] text-white text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#311a7f] transition-colors"
      >
        <MapPin size={14} className="text-purple-300 shrink-0" />
        <span className="font-medium text-purple-200 shrink-0">Deliver to:</span>
        <span className="font-bold truncate max-w-[250px] sm:max-w-md">
          {activeAddress ? (
            <>
              <span className="uppercase text-yellow-300 mr-1">
                {activeAddress.type || "HOME"}
              </span> 
              - {activeAddress.addressLine1 || activeAddress.city} 
              {activeAddress.pincode ? `, ${activeAddress.pincode}` : ''}
            </>
          ) : (
            "Select Location"
          )}
        </span>
      </div>

      {/* --- SEARCH BAR (CLICK TO NAVIGATE) --- */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow-sm border-b border-gray-100">
        <div 
          onClick={() => navigate('/search')} 
          className="relative w-full cursor-pointer"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <div className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-gray-500 text-sm font-medium hover:border-purple-200 hover:bg-white transition-all">
            Search for gifts, brands and more...
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <CategoryRail />

      {/* --- TRENDING SECTION --- */}
      <ProductGrid 
        type="trending" 
        title="Trending Now" 
        // UPDATED: Pass 'sort' parameter, do NOT search for text "trending"
        seeAllLink={`/search/results?sort=trending`} 
        limit={12} 
        mode="horizontal" 
      />

      {/* --- SUGGESTED SECTION --- */}
      <ProductGrid 
        type="suggested" 
        title="Suggested for You" 
        // UPDATED: Pass 'sort' parameter
        seeAllLink={`/search/results?sort=recommended`}
        limit={8} 
        mode="vertical" 
      />

      <Footer />
    </div>
  );
};

export default Home;