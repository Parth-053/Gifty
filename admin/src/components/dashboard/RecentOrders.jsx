import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { EyeIcon } from "@heroicons/react/24/outline";

const RecentOrders = ({ orders, loading }) => {
  const navigate = useNavigate();
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-900">Recent Orders</h3>
        <button 
          onClick={() => navigate("/orders")}
          className="text-sm text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
        >
          View All
        </button>
      </div>

      {/* Responsive Scroll Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeOrders.length > 0 ? (
              safeOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.user?.name || order.user?.email || "Guest"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      order.status === 'Delivered' ? 'success' :
                      order.status === 'Cancelled' ? 'danger' :
                      order.status === 'Processing' ? 'info' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-1">No orders found</p>
                    <span className="text-xs text-gray-300">New orders will appear here</span>
                  </div>
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