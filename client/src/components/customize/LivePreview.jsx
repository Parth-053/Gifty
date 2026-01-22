import React from 'react';
import { X } from 'lucide-react';

const LivePreview = ({ baseProduct, layers, onRemoveLayer }) => {
  if (!baseProduct) return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-bold">
      Select a product to start
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      
      {/* Canvas Container */}
      <div className="relative w-full max-w-md aspect-square bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Base Product Image */}
        <img 
          src={baseProduct.images?.[0]?.url} 
          alt="Base" 
          className="w-full h-full object-contain pointer-events-none select-none z-0"
        />

        {/* Customizable Overlay Area (Roughly centered, adjust based on product mask if needed) */}
        <div className="absolute inset-[20%] border border-dashed border-gray-300/50 pointer-events-none z-10 rounded-lg" />

        {/* User Layers */}
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move group z-20"
            // Note: In a real app, you'd use a Drag-and-Drop library (dnd-kit) here for positioning
            style={{ 
              top: layer.y || '50%', 
              left: layer.x || '50%' 
            }}
          >
            {/* Delete Button (Visible on Hover) */}
            <button 
              onClick={() => onRemoveLayer(layer.id)}
              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:scale-110"
            >
              <X size={12} strokeWidth={3} />
            </button>

            {/* Content */}
            {layer.type === 'text' ? (
              <p 
                className="text-2xl font-bold text-gray-900 leading-none whitespace-nowrap drop-shadow-sm border-2 border-transparent group-hover:border-blue-400/50 p-1 rounded dashed"
                style={{ color: layer.color || 'black', fontSize: layer.size || 24 }}
              >
                {layer.content}
              </p>
            ) : (
              <img 
                src={layer.content} 
                alt="Layer" 
                className="w-32 h-32 object-contain border-2 border-transparent group-hover:border-blue-400/50 rounded dashed"
              />
            )}
          </div>
        ))}
      </div>
      
      <p className="absolute bottom-4 text-xs text-gray-400 font-medium">
        Preview Mode • Elements centered by default
      </p>
    </div>
  );
};

export default LivePreview;