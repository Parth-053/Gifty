import React from 'react';
import { Edit2, Trash2, Eye, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const ProductTable = ({ products, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <th className="py-4 px-6">Product Item</th>
            <th className="py-4 px-6">Category</th>
            <th className="py-4 px-6">Price</th>
            <th className="py-4 px-6">Stock Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.images?.[0] || "https://via.placeholder.com/150"} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100" 
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] font-medium text-gray-400">SKU: {item._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{item.category}</span>
              </td>
              <td className="py-4 px-6 text-sm font-black text-gray-900">{formatPrice(item.price)}</td>
              <td className="py-4 px-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={item.stock < 10 ? 'text-red-500' : 'text-gray-400'}>
                      {item.stock} Left
                    </span>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.stock < 10 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${Math.min((item.stock / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onView(item._id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;