import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrders = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
        <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
        <Link to="/orders" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
          View All
        </Link>
      </div>

      {/* Scrollable Table Container */}
      {/* flex-1 ensures it fills remaining height, overflow-auto handles scrolling */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Order ID</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Amount</th>
              <th className="px-5 py-3 font-medium text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
                    <Link to={`/orders/${order._id}`} className="hover:text-indigo-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </Link>
                    <div className="text-xs text-gray-400 font-normal">
                      {order.user?.fullName || "Guest"}
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="font-semibold text-gray-700">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400 text-xs">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;