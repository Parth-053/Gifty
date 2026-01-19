import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProducts, updateProductStatus } from "../../store/productSlice";
import { FiCheckCircle, FiXCircle, FiBox } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const ProductList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);

  // 1. Fetch Pending Products
  useEffect(() => {
    dispatch(fetchPendingProducts());
  }, [dispatch]);

  const handleAction = async (id, status) => {
    try {
      await dispatch(updateProductStatus({ id, status })).unwrap();
      toast.success(`Product ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading && list.length === 0) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pending Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            {/* Image Preview */}
            <div className="h-48 bg-gray-100 relative">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <FiBox size={40} />
                </div>
              )}
              <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                ₹{product.price}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Seller: {product.sellerId?.storeName || "Unknown"}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
              </div>
              
              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => handleAction(product._id, "active")}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FiCheckCircle /> Approve
                </button>
                <button
                  onClick={() => handleAction(product._id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {list.length === 0 && !loading && (
         <div className="text-center py-10 text-gray-500">
             No products waiting for approval.
         </div>
      )}
    </div>
  );
};

export default ProductList;