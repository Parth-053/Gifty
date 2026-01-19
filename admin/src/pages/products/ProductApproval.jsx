import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProducts, updateProductStatus } from "../../store/productSlice";
import { FiCheckCircle, FiXCircle, FiBox, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const ProductApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Ensure productSlice has 'list' populated by fetchPendingProducts
  const { list, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchPendingProducts());
  }, [dispatch]);

  const handleAction = async (id, status) => {
    try {
      await dispatch(updateProductStatus({ id, status })).unwrap();
      toast.success(`Product ${status}`);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading && list.length === 0) return <Loader />;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Approvals</h1>
          <p className="text-gray-500">Validate products before they go live on Gifty.</p>
        </div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          Pending: {list.length}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <FiBox className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500">No products waiting for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden group">
              {/* Image Area */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FiBox size={32} />
                  </div>
                )}
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100"
                  >
                    <FiEye /> View Details
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
                  <span className="text-green-600 font-bold text-sm">₹{product.price}</span>
                </div>
                
                <p className="text-xs text-gray-500 mb-4 flex-1">
                  By: <span className="font-medium text-gray-700">{product.sellerId?.storeName || "Unknown"}</span>
                </p>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleAction(product._id, "active")}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium transition"
                  >
                    <FiCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(product._id, "rejected")}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium transition"
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductApproval;