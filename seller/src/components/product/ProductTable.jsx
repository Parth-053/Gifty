import React from 'react';
import { Edit2, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 cursor-pointer group flex items-center gap-1">
                Price <ArrowUp size={12} className="opacity-0 group-hover:opacity-100" />
              </th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* Product Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        <img 
                          src={item.image || "https://via.placeholder.com/150"} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">ID: #{item.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm text-gray-600">{item.category}</td>
                  
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">₹{item.price}</td>

                  {/* Stock Logic */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 w-16 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min(item.stock, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.stock}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.stock > 0 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {item.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;