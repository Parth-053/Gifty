import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { updateSellerStatus, fetchSellers, fetchPendingSellers } from "../../store/sellerSlice";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, BuildingLibraryIcon, MapPinIcon } from "@heroicons/react/24/outline";

// Components
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const SellerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isApprovalMode = searchParams.get("mode") === "approval";

  // Redux Selectors - check both lists to find the seller
  const { sellers, pendingSellers, loading } = useSelector((state) => state.sellers);
  
  const [seller, setSeller] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "", title: "", message: "" });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data if missing (Reload case)
  useEffect(() => {
    if (sellers.length === 0 && pendingSellers.length === 0) {
       dispatch(fetchSellers());
       dispatch(fetchPendingSellers());
    }
  }, [dispatch, sellers.length, pendingSellers.length]);

  // Find Seller in store
  useEffect(() => {
    const found = pendingSellers.find(s => s._id === id) || sellers.find(s => s._id === id);
    setSeller(found);
  }, [id, sellers, pendingSellers]);

  const handleActionClick = (type) => {
    let title, message;
    if (type === "approved") {
        title = "Approve Seller?";
        message = "This will grant the seller access to their dashboard and allow product listings.";
    } else if (type === "rejected") {
        title = "Reject Seller?";
        message = "This will reject the application. The seller will be notified.";
    } else if (type === "suspended") {
        title = "Suspend Seller?";
        message = "This will disable the seller's account and hide their products.";
    } else if (type === "active") { // Reactivate
        title = "Reactivate Seller?";
        message = "This will restore access to the seller's account.";
    }
    setModalConfig({ isOpen: true, type, title, message });
  };

  const confirmAction = async () => {
    setActionLoading(true);
    // Determine status string based on action type
    // If reactivating, we set status to 'approved'
    const status = modalConfig.type === "active" ? "approved" : modalConfig.type;
    
    await dispatch(updateSellerStatus({ id: seller._id, status }));
    setActionLoading(false);
    setModalConfig({ ...modalConfig, isOpen: false });
    
    if (isApprovalMode) navigate("/sellers/approvals");
  };

  if (!seller) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            {loading ? <Loader size="lg" text="Loading details..." /> : <p>Seller not found</p>}
        </div>
    );
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
            <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
            <p className="text-sm text-gray-500">
                Owner: {seller.fullName} • Joined {new Date(seller.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Badge variant={
                seller.status === "approved" ? "success" : 
                seller.status === "suspended" ? "danger" : 
                seller.status === "pending" ? "warning" : "default"
            }>
                {seller.status.toUpperCase()}
            </Badge>

            {/* Action Buttons based on Status */}
            {seller.status === "pending" && (
                <>
                    <Button variant="danger" onClick={() => handleActionClick("rejected")}>Reject</Button>
                    <Button variant="primary" onClick={() => handleActionClick("approved")}>Approve</Button>
                </>
            )}
            {seller.status === "approved" && (
                <Button variant="danger" onClick={() => handleActionClick("suspended")}>Suspend Account</Button>
            )}
            {seller.status === "suspended" && (
                <Button variant="primary" onClick={() => handleActionClick("active")}>Reactivate</Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{seller.email}</p>
                </div>
                <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{seller.phone}</p>
                </div>
                <div>
                    <p className="text-gray-500">GSTIN</p>
                    <p className="font-mono font-medium text-gray-900">{seller.gstin || "Not Provided"}</p>
                </div>
            </div>
        </div>

        {/* Business Address */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Business Address</h3>
            </div>
            {seller.businessAddress ? (
                <address className="not-italic text-sm text-gray-600 leading-6">
                    {seller.businessAddress.street}<br />
                    {seller.businessAddress.city}, {seller.businessAddress.state}<br />
                    {seller.businessAddress.zipCode}<br />
                    {seller.businessAddress.country}
                </address>
            ) : (
                <p className="text-sm text-gray-500">No address provided.</p>
            )}
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2 border-b pb-2">
                <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Bank Details</h3>
            </div>
            {seller.bankDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-900">{seller.bankDetails.bankName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Account Number</p>
                        <p className="font-mono font-medium text-gray-900">{seller.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">IFSC Code</p>
                        <p className="font-mono font-medium text-gray-900">{seller.bankDetails.ifscCode}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Account Holder</p>
                        <p className="font-medium text-gray-900">{seller.bankDetails.accountName}</p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No bank details provided.</p>
            )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({...modalConfig, isOpen: false})}
        onConfirm={confirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default SellerDetails;