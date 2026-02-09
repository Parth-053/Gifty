import React from "react";
import { Link } from "react-router-dom";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  SparklesIcon 
} from "@heroicons/react/24/outline";
import { formatPrice } from "../../utils/formatPrice";

const ProductTable = ({ products, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Attributes</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
              
              {/* 1. Product Info */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    <img
                      src={product.images?.[0]?.url || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category?.name || product.category}</p>
                  </div>
                </div>
              </td>

              {/* 2. Price (With Discount Logic) */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <>
                      <span className="font-bold text-gray-900">{formatPrice(product.discountPrice)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                  )}
                </div>
              </td>

              {/* 3. Stock */}
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 10 ? "bg-green-50 text-green-700" : 
                  product.stock > 0 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"
                }`}>
                  {product.stock} units
                </span>
              </td>

              {/* 4. Status (Verification & Active) */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  {/* Verification Status */}
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${
                    product.verificationStatus === 'approved' ? 'text-green-600' :
                    product.verificationStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {product.verificationStatus}
                  </span>
                  
                  {/* Active Toggle Status */}
                  <span className={`text-xs ${product.isActive ? 'text-gray-500' : 'text-gray-400 italic'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </td>

              {/* 5. Attributes (Customizable & Tags) */}
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {product.isCustomizable && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                      <SparklesIcon className="w-3 h-3" /> Custom
                    </span>
                  )}
                  {product.tags?.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs border border-gray-200">
                      {tag}
                    </span>
                  ))}
                  {product.tags?.length > 2 && (
                    <span className="text-xs text-gray-400">+{product.tags.length - 2}</span>
                  )}
                </div>
              </td>

              {/* 6. Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/products/edit/${product._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;