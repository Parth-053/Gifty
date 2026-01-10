import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Products</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-gray-800">{cat.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{cat.productsCount} items</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    cat.status === 'Active' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;