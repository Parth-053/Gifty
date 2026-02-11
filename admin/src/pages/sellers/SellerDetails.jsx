import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchSellerDetails, 
  updateSellerStatus, 
  deleteSeller, 
  clearCurrentSeller 
} from "../../store/sellerSlice";
import { toast } from "react-hot-toast";

import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { 
  NoSymbolIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSeller, loading, actionLoading } = useSelector((state) => state.sellers);

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSellerDetails(id));
    return () => {
      dispatch(clearCurrentSeller());
    };
  }, [dispatch, id]);

  if (loading || !currentSeller) {
    return <div className="flex justify-center items-center h-[70vh]"><Loader size="lg" /></div>;
  }

  // Check if seller is currently banned/suspended
  const isBanned = currentSeller.status === "suspended" || currentSeller.status === "banned";

  // Handlers
  const handleBanToggle = async () => {
    const actionType = isBanned ? "unban" : "ban";
    const result = await dispatch(updateSellerStatus({ id: currentSeller._id, action: actionType }));
    
    if (!result.error) {
      toast.success(`Seller ${actionType === 'ban' ? 'banned and products deactivated' : 'unbanned'} successfully.`);
      setBanModalOpen(false);
    } else {
      toast.error(result.payload || "Action failed");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteSeller(currentSeller._id));
    
    if (!result.error) {
      toast.success("Seller and all associated products deleted permanently.");
      navigate("/sellers"); // Redirect back to the sellers list
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/sellers")} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
             <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase shrink-0">
            {currentSeller.storeName?.charAt(0) || "S"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentSeller.storeName}</h1>
            <p className="text-gray-500">{currentSeller.email}</p>
            <div className="mt-2">
              <Badge variant={isBanned ? "danger" : currentSeller.isActive ? "success" : "warning"}>
                {isBanned ? "BANNED" : currentSeller.isActive ? "ACTIVE" : "PENDING / INACTIVE"}
              </Badge>
            </div>
          </div>
        </div>

        {/* ADMIN ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          {isBanned ? (
             <Button variant="success" onClick={handleBanToggle} isLoading={actionLoading}>
                <CheckCircleIcon className="h-5 w-5 mr-2" /> Unban Seller
             </Button>
          ) : (
             <Button variant="warning" onClick={() => setBanModalOpen(true)}>
                <NoSymbolIcon className="h-5 w-5 mr-2" /> Ban Seller
             </Button>
          )}

          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
             <TrashIcon className="h-5 w-5 mr-2" /> Delete Account
          </Button>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Seller Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Full Name</span><span className="font-medium text-gray-900">{currentSeller.fullName}</span></div>
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Phone</span><span className="font-medium text-gray-900">{currentSeller.phone}</span></div>
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Joined</span><span className="font-medium text-gray-900">{new Date(currentSeller.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Total Products Uploaded</span><span className="font-medium text-gray-900">{currentSeller.totalProducts || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">GSTIN</span><span className="font-medium text-gray-900">{currentSeller.gstin || "N/A"}</span></div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Bank Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Account Name</span><span className="font-medium text-gray-900">{currentSeller.bankDetails?.accountHolderName || "N/A"}</span></div>
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Bank Name</span><span className="font-medium text-gray-900">{currentSeller.bankDetails?.bankName || "N/A"}</span></div>
            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Account No.</span><span className="font-medium text-gray-900">{currentSeller.bankDetails?.accountNumber || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">IFSC Code</span><span className="font-medium text-gray-900">{currentSeller.bankDetails?.ifscCode || "N/A"}</span></div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Business Address</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
             {currentSeller.address?.street ? (
               <>
                 {currentSeller.address.street},<br/>
                 {currentSeller.address.city}, {currentSeller.address.state} - {currentSeller.address.pincode}<br/>
                 {currentSeller.address.country}
               </>
             ) : "Address not provided."}
          </p>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Ban Modal */}
      <ConfirmDialog
        isOpen={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        title="Ban Seller Account?"
        message="Banning this seller will immediately deactivate their account and ALL of their products. Customers will no longer be able to view or buy their items."
        onConfirm={handleBanToggle}
        confirmText="Yes, Ban Seller"
        variant="warning"
      />

      {/* Delete Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Permanently Delete Seller?"
        message={`WARNING: This will permanently delete ${currentSeller.storeName} and ALL of their uploaded products from the database, including product images. This action CANNOT be undone.`}
        onConfirm={handleDelete}
        confirmText="Permanently Delete"
        variant="danger"
      />

    </div>
  );
};

export default SellerDetails;