import React from 'react';
import { Eye } from 'lucide-react';

const OrderTable = ({ orders, onView }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Total</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-800 text-sm">{order.id}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{order.date}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.customer}</td>
                <td className="py-4 px-6 font-bold text-gray-900">₹{order.total}</td>
                <td className="py-4 px-6">
                   <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                   }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => onView(order.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye size={18} />
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

export default OrderTable;