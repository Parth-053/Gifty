import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { fetchProductDetails, updateProductStatus, clearCurrentProduct } from "../../store/productSlice";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Components
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import formatCurrency from "../../utils/formatCurrency";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isApprovalMode = searchParams.get("mode") === "approval";

  const { currentProduct: product, loading } = useSelector((state) => state.products);
  
  // Local State for Rejection
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    return () => { dispatch(clearCurrentProduct()); };
  }, [dispatch, id]);

  const handleStatusChange = async (status, reason = "") => {
    setActionLoading(true);
    await dispatch(updateProductStatus({ id: product._id, status, reason }));
    setActionLoading(false);
    
    if (status === "rejected") setRejectModalOpen(false);
    // Navigate back to approval list if in approval mode
    if (isApprovalMode) navigate("/products/approvals");
  };

  if (loading || !product) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">Seller: {product.sellerId?.storeName}</p>
          </div>
        </div>
        
        <Badge variant={product.verificationStatus === "approved" ? "success" : product.verificationStatus === "rejected" ? "danger" : "warning"}>
          {product.verificationStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Verification Actions (Only if Pending or specific mode) */}
      {product.verificationStatus === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">!</div>
             <div>
                <h3 className="font-semibold text-gray-900">Verification Required</h3>
                <p className="text-sm text-gray-600">This product is pending admin approval.</p>
             </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="danger" 
              onClick={() => setRejectModalOpen(true)}
              disabled={actionLoading}
            >
              <XCircleIcon className="h-5 w-5 mr-2" />
              Reject
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleStatusChange("approved")}
              isLoading={actionLoading}
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img 
              src={product.images?.[0]?.url} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                <img src={img.url} alt="" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Product Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-bold text-lg text-gray-900">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-gray-500">Discount Price</p>
                <p className="font-medium text-gray-900">{product.discountPrice ? formatCurrency(product.discountPrice) : "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Stock</p>
                <p className="font-medium text-gray-900">{product.stock} units</p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{product.categoryId?.name}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            </div>
            
            {product.isCustomizable && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-xs font-bold text-indigo-700 uppercase mb-1">Customization Available</p>
                <div className="flex flex-wrap gap-2">
                   {product.customizationOptions?.map(opt => (
                     <span key={opt} className="px-2 py-1 bg-white text-indigo-600 text-xs rounded border border-indigo-100">{opt}</span>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal 
        isOpen={rejectModalOpen} 
        onClose={() => setRejectModalOpen(false)}
        title="Reject Product"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this product. This will be sent to the seller.
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            rows="4"
            placeholder="e.g., Image quality is too low, Inappropriate content..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={() => handleStatusChange("rejected", rejectReason)}
              disabled={!rejectReason.trim()}
              isLoading={actionLoading}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetails;