import React from 'react';
import { Edit2, Trash2, Eye, Layers } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete, onView }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 border-b border-gray-100">
        <tr>
          <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
          <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
          <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
          <th className="px-6 py-4 text-right font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">N/A</div>
                  )}
                </div>
                <div>
                   <p className="font-bold text-gray-800">{cat.name}</p>
                   {cat.description && <p className="text-xs text-gray-400 truncate max-w-[150px]">{cat.description}</p>}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm">
              {cat.parentId ? (
                <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs w-fit font-medium">
                   <Layers size={12} /> Sub-Category
                </span>
              ) : (
                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">Main Category</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onView(cat._id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye size={18} />
                </button>
                <button onClick={() => onEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;