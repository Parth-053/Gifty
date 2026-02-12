import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../store/bannerSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules'; // Removed Navigation module
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const HeroBanner = () => {
  const dispatch = useDispatch();
  
  // FIX: Safely access state with fallbacks to prevent "undefined" errors
  const { list, loading } = useSelector((state) => state.banners || {});
  const banners = list || []; // Default to empty array if list is undefined

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // Combine AI Slide + Admin Banners
  const allSlides = [
    { type: 'AI_BANNER', id: 'ai-fixed' }, 
    ...banners.filter(b => b.isActive) // Now safe because 'banners' is guaranteed to be an array
  ];

  if (loading && banners.length === 0) return (
    <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-100 animate-pulse rounded-xl my-4 mx-4" />
  );

  return (
    <div className="px-4 py-4">
      <Swiper
        modules={[Autoplay, Pagination]} 
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        grabCursor={true} // <--- Enables "Hand" cursor and manual swiping logic
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full rounded-2xl overflow-hidden shadow-sm"
      >
        {allSlides.map((slide) => (
          <SwiperSlide key={slide._id || slide.id}>
            
            {/* --- 1. FIXED AI BANNER --- */}
            {slide.type === 'AI_BANNER' ? (
              <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 flex items-center px-6 sm:px-12 md:px-16 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 max-w-lg">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                    <Sparkles size={14} className="text-yellow-300" />
                    <span>AI Powered</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
                    Can't Decide? <br/> Let AI Find the Perfect Gift.
                  </h2>
                  <p className="text-purple-100 mb-6 text-sm sm:text-base hidden sm:block">
                    Tell us about the occasion and relationship, and our AI will generate personalized suggestions instantly.
                  </p>
                  <Link 
                    to="/customize" 
                    className="inline-block bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Generate Now ✨
                  </Link>
                </div>
                <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-100">
                   <Sparkles size={120} className="text-white/20 rotate-12" />
                </div>
              </div>
            ) : (
              /* --- 2. ADMIN UPLOADED BANNERS --- */
              <Link to={slide.link || '/categories'} className="block w-full h-full relative">
                <img
                  src={slide.image?.url}
                  alt={slide.title}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl sm:text-3xl font-bold">{slide.title}</h3>
                    {slide.subtitle && <p className="text-gray-200 mt-1">{slide.subtitle}</p>}
                  </div>
                </div>
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;