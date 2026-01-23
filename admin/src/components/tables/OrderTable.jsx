import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const OrderTable = ({ orders, onView }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">#{order.orderId}</div>
                <div className="text-xs text-gray-500">{order.items?.length} items</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.userId?.fullName || "Guest User"}
                </div>
                <div className="text-xs text-gray-500">{order.userId?.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {formatCurrency(order.finalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase text-gray-700">{order.paymentMethod}</span>
                  <Badge 
                    variant={
                      order.paymentInfo?.status === "paid" ? "success" :
                      order.paymentInfo?.status === "failed" ? "danger" :
                      order.paymentInfo?.status === "refunded" ? "warning" : "info"
                    }
                    size="sm"
                  >
                    {order.paymentInfo?.status || "Pending"}
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge 
                  variant={
                    order.orderStatus === "delivered" ? "success" :
                    order.orderStatus === "cancelled" ? "danger" :
                    order.orderStatus === "placed" ? "info" : "warning"
                  }
                >
                  {order.orderStatus.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(order._id)}
                  className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;