import React, { useState } from 'react';

const ProductImages = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) return <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">No Image</div>;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group">
        <img 
          src={images[selectedImage]?.url} 
          alt="Product View"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`
              flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
              ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'}
            `}
          >
            <img src={img.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;