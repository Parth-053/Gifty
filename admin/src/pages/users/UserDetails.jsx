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
import EmptyState from "../../components/common/EmptyState";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8">
        <EmptyState 
            title="User not found" 
            description="The user you are looking for does not exist or has been deleted." 
            action={{ label: "Back to Users", onClick: () => navigate('/users') }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Details</h1>
            <p className="text-sm text-gray-500">ID: {user._id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={user.isActive === false ? "primary" : "danger"}
            icon={user.isActive === false ? ShieldExclamationIcon : NoSymbolIcon}
            onClick={() => setBlockModalOpen(true)}
          >
            {user.isActive === false ? "Unblock User" : "Block User"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <img 
              src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} 
              alt={user.fullName}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-50 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-500 mb-4">{user.email}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant={user.isActive !== false ? "success" : "danger"}>
                {user.isActive !== false ? "Active" : "Blocked"}
              </Badge>
              <Badge variant={user.isEmailVerified ? "success" : "warning"}>
                {user.isEmailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <div className="text-left space-y-3 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Joined Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>
            </div>
            
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-3 border border-gray-100 rounded-lg bg-gray-50 text-sm">
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            addr.type === 'Home' ? 'bg-blue-100 text-blue-700' : 
                            addr.type === 'Work' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {addr.type || 'HOME'}
                        </span>
                    </div>
                    {/* Fixed: Matches Address.model.js field 'fullName' */}
                    <p className="font-medium text-gray-900 mb-0.5">{addr.fullName || user.fullName}</p>
                    
                    <p className="text-gray-600 leading-tight">
                      {addr.addressLine1}
                    </p>
                    {addr.addressLine2 && <p className="text-gray-600 leading-tight">{addr.addressLine2}</p>}
                    
                    <p className="text-gray-600 mt-0.5">
                      {addr.city}, {addr.state} - <span className="font-medium">{addr.pincode}</span>
                    </p>
                    
                    <p className="text-gray-500 mt-1 text-xs">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic border border-dashed border-gray-200 p-4 rounded-lg text-center">
                No addresses saved for this user.
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={toggleBlockStatus}
        title={user?.isActive === false ? "Unblock User?" : "Block User?"}
        message={user?.isActive === false 
          ? "This will restore the user's access to the platform." 
          : "This will prevent the user from logging in or placing new orders."
        }
        confirmText={user?.isActive === false ? "Unblock" : "Block"}
        variant={user?.isActive !== false ? "danger" : "primary"}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default UserDetails;