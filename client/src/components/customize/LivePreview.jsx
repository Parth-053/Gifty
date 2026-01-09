import React from 'react';

const LivePreview = ({ product, customText, textColor, customColor }) => {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden h-full">
      {/* Base Product Image Container */}
      <div className="relative w-80 h-80 shadow-xl rounded-xl bg-white overflow-hidden transition-all duration-300">
        
        {/* The Product Image */}
        <img src={product.image} className="w-full h-full object-cover" alt="preview" />
        
        {/* ✨ OVERLAY: Dynamic Text */}
        {customText && (
          <div 
            className="absolute pointer-events-none break-words text-center leading-tight transition-colors duration-300"
            style={{ 
              top: product.defaultTextPosition.top, 
              left: product.defaultTextPosition.left,
              width: '40%', // Limits width so text wraps
              color: textColor,
              fontFamily: 'cursive', 
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {customText}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;