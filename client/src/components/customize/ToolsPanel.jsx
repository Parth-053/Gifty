import React from 'react';
import { Type, Palette, Image as ImageIcon, ShoppingBag } from 'lucide-react';

const ToolsPanel = ({ 
  product, 
  customText, setCustomText, 
  textColor, setTextColor,
  customColor, setCustomColor 
}) => {
  return (
    <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-6 z-10">
      
      <div className="space-y-6">
        
        {/* Text Tool */}
        {product.allowedOptions.includes('text') && (
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
              <Type size={14} /> ADD TEXT
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type Name or Quote..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#FF6B6B]"
              />
              <input 
                type="color" 
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Color Tool */}
        {product.allowedOptions.includes('color') && (
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
              <Palette size={14} /> PRODUCT COLOR
            </label>
            <div className="flex gap-3">
              {['white', 'black', 'red', 'blue'].map((color) => (
                <button 
                  key={color}
                  onClick={() => setCustomColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${customColor === color ? 'border-[#FF6B6B] scale-110' : 'border-gray-200'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Image Tool (Dummy) */}
        {product.allowedOptions.includes('image') && (
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
              <ImageIcon size={14} /> UPLOAD PHOTO
            </label>
            <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-400 text-xs font-bold hover:bg-gray-50 transition-colors">
              + Choose from Gallery
            </button>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button className="w-full mt-8 bg-[#2D3436] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
        <ShoppingBag size={18} />
        Add to Cart - ₹{product.price}
      </button>

    </div>
  );
};

export default ToolsPanel;