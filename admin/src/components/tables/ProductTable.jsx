import React from "react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Badge from "../common/Badge";
import formatCurrency from "../../utils/formatCurrency";

const ProductTable = ({ products, onView, isPending = false }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-md object-cover border border-gray-200"
                      src={product.images?.[0]?.url || "https://via.placeholder.com/40"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {product.name}
                    </div>
                    {isPending && (
                       <div className="text-xs text-gray-500">
                         Added: {new Date(product.createdAt).toLocaleDateString()}
                       </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.categoryId?.name || "Uncategorized"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm text-gray-900">{product.sellerId?.storeName || "Unknown Store"}</div>
                 <div className="text-xs text-gray-500">{product.sellerId?.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</div>
                <div className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  Stock: {product.stock}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge 
                  variant={
                    product.verificationStatus === "approved" ? "success" :
                    product.verificationStatus === "rejected" ? "danger" : "warning"
                  }
                >
                  {product.verificationStatus}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(product._id)}
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

export default ProductTable;