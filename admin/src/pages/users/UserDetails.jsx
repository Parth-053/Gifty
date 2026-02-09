import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserDetails, updateUserStatus, clearCurrentUser } from "../../store/userSlice";
import { ArrowLeftIcon, MapPinIcon, ShieldExclamationIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

// Components
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FIX: safely access state
  const { currentUser: user, loading } = useSelector((state) => state.users || {});
  
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails(id));
    return () => { dispatch(clearCurrentUser()); };
  }, [dispatch, id]);

  const toggleBlockStatus = async () => {
    if (!user) return;
    setActionLoading(true);
    const newStatus = !user.isActive; 
    
    await dispatch(updateUserStatus({ id: user._id, isActive: newStatus }));
    setActionLoading(false);
    setBlockModalOpen(false);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // 2. Error/Not Found State (Prevents crash if user is null)
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found.</p>
        <Button variant="outline" onClick={() => navigate("/users")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Navigation */}
      <button 
        onClick={() => navigate("/users")}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Users
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner/Header */}
        <div className="bg-gray-50 px-6 py-8 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold uppercase">
              {user.fullName?.[0] || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{user.email}</span>
                <span>•</span>
                <Badge variant={user.role === 'admin' ? 'purple' : 'blue'}>{user.role}</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {user.role !== 'admin' && (
              <Button 
                variant={user.isActive ? "danger" : "success"}
                onClick={() => setBlockModalOpen(true)}
                icon={user.isActive ? NoSymbolIcon : ShieldExclamationIcon}
              >
                {user.isActive ? "Block User" : "Unblock User"}
              </Button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">{user.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Joined Date</span>
                <span className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Status</span>
                <Badge variant={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? 'Active' : 'Blocked'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
            </div>
            
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-3 border border-gray-100 rounded-lg bg-gray-50 text-sm">
                    <p className="font-medium text-gray-900 mb-1">{addr.name || user.fullName}</p>
                    <p className="text-gray-600">{addr.addressLine1}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-gray-600 mt-1 text-xs">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic border border-dashed border-gray-200 p-4 rounded-lg text-center">
                No addresses saved.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Blocking */}
      <ConfirmDialog 
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={toggleBlockStatus}
        title={user.isActive === false ? "Unblock User?" : "Block User?"}
        message={user.isActive === false 
          ? "This will restore the user's access to the platform." 
          : "This will prevent the user from logging in or placing new orders."
        }
        confirmText={user.isActive === false ? "Unblock" : "Block"}
        variant={user.isActive ? "danger" : "primary"}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default UserDetails;