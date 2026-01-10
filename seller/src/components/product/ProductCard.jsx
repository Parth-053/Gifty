import React from 'react';
import { Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
      
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative group">
        <img 
          src={product.image || "https://via.placeholder.com/150"} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
        />
        {/* Quick Status Badge on Image */}
        {product.stock <= 5 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Low Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
            <button className="text-gray-400 p-1">
              <MoreVertical size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500">{product.category}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-extrabold text-gray-900">₹{product.price}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(product)}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;