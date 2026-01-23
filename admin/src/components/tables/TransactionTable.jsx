import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID / Gateway ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((txn) => (
            <tr key={txn._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#{txn._id.slice(-6).toUpperCase()}</div>
                <div className="text-xs text-gray-500 font-mono">{txn.paymentGatewayId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                {txn.orderId ? `#${txn.orderId._id?.slice(-6).toUpperCase()}` : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(txn.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {txn.paymentMethod}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {formatCurrency(txn.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge 
                  variant={
                    txn.status === "success" ? "success" :
                    txn.status === "failed" ? "danger" :
                    txn.status === "refunded" ? "warning" : "info"
                  }
                >
                  {txn.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;