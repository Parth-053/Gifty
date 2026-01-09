import React, { useState, useEffect } from 'react';

const banners = [
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop", // Gift Box
  "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop", // Birthday
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop"  // Holiday
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Scroll Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 mt-4">
      <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md">
        {/* Images */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((src, index) => (
            <img 
              key={index} 
              src={src} 
              alt="Banner" 
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Overlay Text (Optional) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">Special Moments</h3>
          <p className="text-white/80 text-xs">Make it memorable with Gifty</p>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {banners.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full ${currentIndex === idx ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;