import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Actions
import { fetchAddresses, deleteAddress, setDefaultAddress } from '../../store/addressSlice';

// Components
import AddressCard from '../../components/user/AddressCard';

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // FIX: Select state directly. Handle undefined/null in the variable assignment below.
  // This prevents the "Selector unknown returned a different result" warning.
  const addressState = useSelector((state) => state.addresses);
  
  const addresses = addressState?.items || [];
  const loading = addressState?.loading || false;

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };

  const handleEdit = (address) => {
    navigate(`/user/addresses/edit/${address._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-black text-gray-900">Saved Addresses</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your delivery locations and preferences</p>
        </div>
        <button 
          onClick={() => navigate('/user/addresses/add')} 
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* --- Content --- */}
      {loading && addresses.length === 0 ? (
        // Loading Skeleton
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Addresses Found</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            You haven't added any addresses yet. Add one to speed up your checkout process.
          </p>
        </div>
      ) : (
        // Address Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
          {addresses.map((addr) => (
            <AddressCard 
              key={addr._id}
              address={addr}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              selected={addr.isDefault} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;