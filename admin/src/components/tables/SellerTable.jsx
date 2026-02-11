import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Badge from "../common/Badge";

const SellerTable = ({ sellers, onView, isPending = false }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner / Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sellers.map((seller) => (
            <tr key={seller._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{seller.storeName}</div>
                {isPending && <div className="text-xs text-orange-600">Pending Approval</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{seller.fullName}</div>
                <div className="text-xs text-gray-500">{seller.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {seller.gstin || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge 
                  variant={
                    seller.status === "approved" ? "success" :
                    (seller.status === "suspended" || seller.status === "banned") ? "danger" :
                    seller.status === "rejected" ? "danger" : "warning"
                  }
                >
                  {/* Display "BANNED" if the status is suspended/banned */}
                  {(seller.status === "suspended" || seller.status === "banned") 
                    ? "BANNED" 
                    : seller.status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(seller.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(seller._id)}
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

export default SellerTable;