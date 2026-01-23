import React from "react";
import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const PayoutTable = ({ payouts, onProcess }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller / Store</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payouts.map((payout) => (
            <tr key={payout._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {payout.payoutId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{payout.sellerId?.storeName || "Unknown Store"}</div>
                <div className="text-xs text-gray-500">{payout.sellerId?.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(payout.transactionDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {formatCurrency(payout.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payout.paymentMethod}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge 
                  variant={
                    payout.status === "Completed" ? "success" :
                    payout.status === "Failed" ? "danger" :
                    payout.status === "Processing" ? "info" : "warning"
                  }
                >
                  {payout.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {payout.status === "Pending" && (
                  <button
                    onClick={() => onProcess(payout)}
                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                  >
                    Process
                  </button>
                )}
                {payout.status === "Completed" && (
                  <span className="text-green-600 text-xs">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;