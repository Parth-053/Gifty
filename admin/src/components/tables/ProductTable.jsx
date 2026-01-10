import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const ProductTable = ({ products, onAction }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Seller</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-blue-600 font-medium">{item.sellerName}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">₹{item.price}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.stock}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    item.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 
                    item.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onAction('view', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                      <Eye size={18} />
                    </button>
                    {item.status === 'Pending' && (
                      <>
                        <button onClick={() => onAction('approve', item)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => onAction('reject', item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
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

export default ProductTable;