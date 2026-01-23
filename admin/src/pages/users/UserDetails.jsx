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

  const { currentUser: user, loading } = useSelector((state) => state.users);
  
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails(id));
    return () => { dispatch(clearCurrentUser()); };
  }, [dispatch, id]);

  const toggleBlockStatus = async () => {
    if (!user) return;
    setActionLoading(true);
    // Toggle logic: If user is active (or verify flag is true), we allow blocking.
    // Note: Adjust 'isActive' logic based on your exact backend implementation.
    const newStatus = !user.isActive; 
    
    await dispatch(updateUserStatus({ id: user._id, isActive: newStatus }));
    setActionLoading(false);
    setBlockModalOpen(false);
  };

  if (loading || !user) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>
        
        {user.role !== "admin" && (
          <Button 
            variant={user.isActive === false ? "success" : "danger"} 
            onClick={() => setBlockModalOpen(true)}
          >
            {user.isActive === false ? (
               <> <ShieldExclamationIcon className="h-5 w-5 mr-2" /> Unblock User </>
            ) : (
               <> <NoSymbolIcon className="h-5 w-5 mr-2" /> Block User </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <img 
            src={user.avatar?.url || "https://via.placeholder.com/150"} 
            alt={user.fullName} 
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-100 mb-4"
          />
          <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant={user.isEmailVerified ? "success" : "warning"}>
              {user.isEmailVerified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant="blue">{user.role}</Badge>
          </div>

          <div className="mt-6 border-t pt-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="font-medium">{user.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined:</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Login:</span>
              <span className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</span>
            </div>
          </div>
        </div>

        {/* Addresses & Activity */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Addresses */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              Saved Addresses
            </h3>
            
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-lg bg-gray-50 text-sm">
                    <p className="font-medium text-gray-900 mb-1">{addr.name || user.fullName}</p>
                    <p className="text-gray-600">{addr.addressLine1}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-gray-600 mt-1 text-xs">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No addresses saved.</p>
            )}
          </div>

          {/* Activity / Orders Placeholder */}
          {/* Note: You can embed the RecentOrders component here passing user.orders if populated */}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={toggleBlockStatus}
        title={user.isActive === false ? "Unblock User?" : "Block User?"}
        message={user.isActive === false 
          ? "This will restore the user's access to the platform." 
          : "This will prevent the user from logging in or placing new orders."}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default UserDetails;