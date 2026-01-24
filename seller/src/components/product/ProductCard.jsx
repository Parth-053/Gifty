import React from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "../../utils/formatPrice";
import Badge from "../common/Badge";

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={product.stock > 0 ? "success" : "danger"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 mb-1">{product.category?.name || "Uncategorized"}</p>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h3>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-indigo-600">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Stock: {product.stock}</p>
        </div>

        {/* Actions Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <Link 
            to={`/products/${product._id}`}
            className="text-xs font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1"
          >
            <EyeIcon className="h-4 w-4" /> View
          </Link>
          <div className="flex gap-2">
            <Link 
              to={`/products/edit/${product._id}`}
              className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
            <button 
              onClick={() => onDelete(product._id)}
              className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;