import React from 'react';
import { Eye } from 'lucide-react';

const OrderTable = ({ orders, onView }) => {
  
  const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
          case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
          case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
          case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
          case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
          default: return 'bg-gray-50 text-gray-600 border-gray-100';
      }
  };

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
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-800 text-sm">#{order.orderId}</td>
                <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-sm font-medium text-gray-700">
                    {order.userId?.name || "Guest User"}
                </td>
                <td className="py-4 px-6 font-bold text-gray-900">₹{order.totalAmount}</td>
                <td className="py-4 px-6">
                   <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => onView(order._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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