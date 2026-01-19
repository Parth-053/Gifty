import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProductStatus } from "../../store/productSlice";
import api from "../../api/axios";
import { FiArrowLeft, FiTag, FiLayers, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/products/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatus = async (status) => {
    try {
        await dispatch(updateProductStatus({ id, status })).unwrap();
        toast.success(`Product ${status}`);
        navigate(-1);
    } catch  {
        toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-black">
        <FiArrowLeft /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            <img 
              src={product.images?.[0]?.url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images?.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600 flex items-center gap-2"><FiTag /> Price</span>
              <span className="font-bold text-xl">₹{product.price}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600 flex items-center gap-2"><FiLayers /> Stock</span>
              <span className="font-bold">{product.stock} units</span>
            </div>
            <div className="flex justify-between pb-2">
               <span className="text-gray-600">Category</span>
               <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                 {product.category?.name || "Uncategorized"}
               </span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold mb-3 text-gray-700">Admin Actions</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => handleStatus('active')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2"
              >
                <FiCheckCircle /> Approve Product
              </button>
              <button 
                onClick={() => handleStatus('rejected')}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-xl font-medium flex justify-center items-center gap-2"
              >
                <FiXCircle /> Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;