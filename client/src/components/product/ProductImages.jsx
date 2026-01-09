import React, { useState } from 'react';

const ProductImages = ({ images }) => {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full h-80 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative">
        <img 
          src={activeImg} 
          alt="Product" 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {images.map((img, index) => (
          <button 
            key={index} 
            onClick={() => setActiveImg(img)}
            className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 overflow-hidden ${activeImg === img ? 'border-[#FF6B6B]' : 'border-transparent'}`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;