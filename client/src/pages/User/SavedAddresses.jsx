import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Actions
import { fetchAddresses, deleteAddress, setDefaultAddress } from '../../store/addressSlice';

// Components
import AddressCard from '../../components/user/AddressCard';

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const addressState = useSelector((state) => state.addresses);
  const addresses = addressState?.items || [];
  const loading = addressState?.loading || false;

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

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
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- THEMED HEADER (Matches Wishlist/Cart) --- */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate('/user/profile')} 
          className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          Saved Addresses
        </h1>

        {/* Add Button in Header for easy access */}
        <button 
          onClick={() => navigate('/user/addresses/add')}
          className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-all"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="p-4 max-w-5xl mx-auto">
        {loading && addresses.length === 0 ? (
          // Loading Skeleton
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl shadow-sm animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <MapPin size={32} className="text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Addresses Found</h3>
            <p className="text-gray-500 max-w-xs mb-8">
              Add an address to speed up your checkout process.
            </p>
            <button 
              onClick={() => navigate('/user/addresses/add')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all active:scale-95"
            >
              Add New Address
            </button>
          </div>
        ) : (
          // Address Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  );
};

export default SavedAddresses;