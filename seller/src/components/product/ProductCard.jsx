import React from 'react';
import { Edit2, Trash2, Eye, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all group">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${product.stock > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {product.stock > 0 ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 mb-4">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{product.category}</p>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <p className="text-lg font-black text-gray-900">{formatPrice(product.price)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => onView(product._id)} className="flex items-center justify-center p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"><Eye size={16}/></button>
        <button onClick={() => onEdit(product)} className="flex items-center justify-center p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all"><Edit2 size={16}/></button>
        <button onClick={() => onDelete(product._id)} className="flex items-center justify-center p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
      </div>
    </div>
  );
};

export default ProductCard;