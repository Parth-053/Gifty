import React from 'react';
import { Eye, ShieldCheck, AlertCircle } from 'lucide-react';

const SellerTable = ({ sellers, onView }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">Store Name</th>
              <th className="py-4 px-6">Owner</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-800">
                    {seller.storeName || "N/A"}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{seller.name}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{seller.email}</td>
                <td className="py-4 px-6">
                   <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                    seller.isVerified 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {seller.isVerified ? <ShieldCheck size={12}/> : <AlertCircle size={12}/>}
                    {seller.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => onView(seller._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-1 ml-auto">
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerTable;