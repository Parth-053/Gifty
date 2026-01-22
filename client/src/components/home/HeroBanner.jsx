import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchBanners } from '../../store/bannerSlice';

const HeroBanner = () => {
  const dispatch = useDispatch();
  const { items: banners, loading } = useSelector((state) => state.banners);
  const [current, setCurrent] = useState(0);

  // 1. Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // 2. Auto-Slide Logic
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 Seconds
    return () => clearInterval(timer);
  }, [banners]);

  const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);

  // Loading State
  if (loading && banners.length === 0) {
    return (
      <div className="w-full h-[200px] sm:h-[400px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  // Empty State
  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 rounded-2xl sm:rounded-3xl shadow-sm group mb-8">
      
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[200px] sm:h-[400px] md:h-[450px]" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner._id} className="min-w-full relative h-full">
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
            
            {/* Dynamic Image */}
            <img 
              src={banner.image?.url} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center text-white px-8 sm:px-12 md:px-16 max-w-2xl">
              <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-3 w-fit">
                Featured
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 tracking-tight drop-shadow-lg leading-tight">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg font-medium mb-6 opacity-90 line-clamp-2">
                {banner.subtitle}
              </p>
              
              {/* Call to Action */}
              {banner.link && (
                <Link 
                  to={banner.link}
                  className="bg-white text-gray-900 px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-sm md:text-base font-bold hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-xl w-fit flex items-center gap-2"
                >
                  Shop Now <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white z-20 hidden sm:flex items-center justify-center transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white z-20 hidden sm:flex items-center justify-center transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;