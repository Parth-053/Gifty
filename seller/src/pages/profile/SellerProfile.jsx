import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updateSellerProfile, clearSellerMessages,  } from "../../store/sellerSlice"; 
// Assuming you will create this new thunk in your sellerSlice
// import { deleteSellerAccount } from "../../store/sellerSlice"; 
import { UserIcon, BuildingStorefrontIcon, BuildingLibraryIcon, CheckBadgeIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

// Hooks & Firebase
import useAuth from "../../hooks/useAuth";
import { auth } from "../../config/firebase";
import { deleteUser } from "firebase/auth";

// Components
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal"; // Added Modal for confirmation

const getInitialData = (prof) => ({
  fullName: prof?.fullName || "",
  email: prof?.email || "",
  phone: prof?.phone || "",
  storeName: prof?.storeName || "",
  gstin: prof?.gstin || "",
  address: {
    street: prof?.address?.street || "",
    city: prof?.address?.city || "",
    state: prof?.address?.state || "",
    pincode: prof?.address?.pincode || "",
    country: prof?.address?.country || "India"
  },
  bankDetails: {
    accountHolderName: prof?.bankDetails?.accountHolderName || "",
    accountNumber: prof?.bankDetails?.accountNumber || "",
    ifscCode: prof?.bankDetails?.ifscCode || "",
    bankName: prof?.bankDetails?.bankName || ""
  }
});

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth(); // Destructure logout from your auth hook
  
  const { profile, loading, actionLoading, success, error } = useSelector((state) => state.seller);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState(null);

  // Delete Account States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!profile) dispatch(fetchSellerProfile());
  }, [dispatch, profile]);

  useEffect(() => {
    if (success) { 
        toast.success(success); 
        dispatch(clearSellerMessages()); 
    }
    if (error) { 
        toast.error(error); 
        dispatch(clearSellerMessages()); 
    }
  }, [success, error, dispatch]);

  const currentData = isEditing && formData ? formData : getInitialData(profile);

  const handleChange = (e) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (e, section) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value
      }
    });
  };

  const handleEditClick = () => {
    setFormData(getInitialData(profile));
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateSellerProfile(formData));
    if (!result.error) {
      setIsEditing(false);
      setFormData(null);
    }
  };

  // --- DELETE ACCOUNT LOGIC ---
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // 1. Call Backend Soft-Delete Route (Uncomment when thunk is ready)
      // const result = await dispatch(deleteSellerAccount());
      // if (result.error) throw new Error(result.error);

      // 2. Remove User from Firebase Authentication (So they can reuse the email later)
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      // 3. Clear Local State & Redirect
      toast.success("Account permanently closed.");
      setDeleteModalOpen(false);
      logout(); // Redirects to login and clears tokens
      
    } catch (err) {
      console.error(err);
      // Firebase specific error handling
      if (err.code === "auth/requires-recent-login") {
         toast.error("Please log out and log back in to verify your identity before deleting.");
      } else {
         toast.error(err.message || "Failed to delete account. Please contact support.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="flex justify-center items-center h-[70vh]"><Loader size="lg" /></div>;
  }

  const getStatusBadge = () => {
    if (profile?.status === "suspended") return <Badge variant="danger">Suspended</Badge>;
    if (profile?.status === "rejected") return <Badge variant="danger">Rejected</Badge>;
    if (profile?.isActive && profile?.isVerified) return <Badge variant="success">Active & Verified</Badge>;
    return <Badge variant="warning">Pending Admin Approval</Badge>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-md shrink-0">
            {currentData.storeName?.charAt(0) || currentData.fullName?.charAt(0) || "S"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{currentData.storeName || "My Store"}</h1>
              {profile?.isVerified && <CheckBadgeIcon className="h-6 w-6 text-blue-500" title="Verified Seller" />}
            </div>
            <p className="text-gray-500 font-medium">{currentData.email}</p>
            <div className="mt-2">{getStatusBadge()}</div>
          </div>
        </div>
        
        {profile?.status === "rejected" && profile?.rejectionReason && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-sm border border-red-200">
             <p className="text-sm font-semibold mb-1">Account Requires Attention</p>
             <p className="text-xs">{profile.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* TABS & FORM SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b bg-gray-50/50 hide-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === "personal" ? "border-b-2 border-indigo-600 text-indigo-600 bg-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserIcon className="h-5 w-5" /> Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === "store" ? "border-b-2 border-indigo-600 text-indigo-600 bg-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <BuildingStorefrontIcon className="h-5 w-5" /> Store & Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === "bank" ? "border-b-2 border-indigo-600 text-indigo-600 bg-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <BuildingLibraryIcon className="h-5 w-5" /> Bank Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === "account" ? "border-b-2 border-red-600 text-red-600 bg-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <ShieldExclamationIcon className="h-5 w-5" /> Account Settings
          </button>
        </div>

        {/* Unified Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6 border-b pb-4 border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Your primary contact details.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="fullName" value={currentData.fullName} onChange={handleChange} disabled={!isEditing} required />
                <Input label="Phone Number" name="phone" value={currentData.phone} onChange={handleChange} disabled={!isEditing} required />
                <div className="md:col-span-2">
                  <Input label="Registered Email (Cannot be changed)" name="email" value={currentData.email} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE & ADDRESS */}
          {activeTab === "store" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="mb-6 border-b pb-4 border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Store Identity</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Store Name" name="storeName" value={currentData.storeName} onChange={handleChange} disabled={!isEditing} required />
                  <Input label="GSTIN Number (Optional)" name="gstin" value={currentData.gstin} onChange={handleChange} disabled={!isEditing} placeholder="e.g., 22AAAAA0000A1Z5" />
                </div>
              </div>
              <div>
                <div className="mb-6 border-b pb-4 border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Registered Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input label="Street Address" name="street" value={currentData.address.street} onChange={(e) => handleNestedChange(e, "address")} disabled={!isEditing} required />
                  </div>
                  <Input label="City" name="city" value={currentData.address.city} onChange={(e) => handleNestedChange(e, "address")} disabled={!isEditing} required />
                  <Input label="State" name="state" value={currentData.address.state} onChange={(e) => handleNestedChange(e, "address")} disabled={!isEditing} required />
                  <Input label="Pincode" name="pincode" value={currentData.address.pincode} onChange={(e) => handleNestedChange(e, "address")} disabled={!isEditing} required />
                  <Input label="Country" name="country" value={currentData.address.country} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK DETAILS */}
          {activeTab === "bank" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6 border-b pb-4 border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Bank Information</h2>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Account Holder Name" name="accountHolderName" value={currentData.bankDetails.accountHolderName} onChange={(e) => handleNestedChange(e, "bankDetails")} disabled={!isEditing} required />
                  <Input label="Bank Name" name="bankName" value={currentData.bankDetails.bankName} onChange={(e) => handleNestedChange(e, "bankDetails")} disabled={!isEditing} required />
                  <Input label="Account Number" name="accountNumber" type={isEditing ? "text" : "password"} value={currentData.bankDetails.accountNumber} onChange={(e) => handleNestedChange(e, "bankDetails")} disabled={!isEditing} required />
                  <Input label="IFSC Code" name="ifscCode" value={currentData.bankDetails.ifscCode} onChange={(e) => handleNestedChange(e, "bankDetails")} disabled={!isEditing} className="uppercase" required />
               </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS (NEW) */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6 border-b pb-4 border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Account Security</h2>
                <p className="text-sm text-gray-500">Manage your active session or close your store.</p>
              </div>

              {/* Log Out Block */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">Sign Out</h3>
                  <p className="text-sm text-gray-500 mt-1">Log out of your seller account on this device.</p>
                </div>
                <Button type="button" variant="outline" onClick={logout}>Sign Out</Button>
              </div>

              {/* Delete Account Block */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-red-800">Close Store & Delete Account</h3>
                  <p className="text-sm text-red-600 mt-1 max-w-xl">
                    This will immediately hide your store and products from customers. Your data will be flagged for permanent deletion by administrators.
                  </p>
                </div>
                <Button type="button" variant="danger" onClick={() => setDeleteModalOpen(true)}>
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS (Hidden on Account Tab) */}
          {activeTab !== "account" && (
            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200 bg-white">
              {!isEditing ? (
                <Button type="button" onClick={handleEditClick} className="px-8 shadow-sm">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handleCancelClick} className="px-6">Cancel</Button>
                  <Button type="submit" isLoading={actionLoading} className="px-8 shadow-sm">Save All Changes</Button>
                </>
              )}
            </div>
          )}
        </form>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Seller Account">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
            <strong>Warning:</strong> Are you sure you want to delete your account? 
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your store will be deactivated.</li>
              <li>Your products will be hidden from users.</li>
              <li>Your Firebase login will be removed immediately.</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            * Administrators will review and permanently erase your database records and images.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} isLoading={deleteLoading}>
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SellerProfile;