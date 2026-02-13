import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin, ArrowLeft, CheckCircle2, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAddresses, deleteAddress, setDefaultAddress } from '../../store/addressSlice';

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: addresses, loading } = useSelector((state) => state.addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (id, e) => {
    e.stopPropagation();
    dispatch(setDefaultAddress(id));
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/user/addresses/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- STANDALONE HEADER --- */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate('/user/profile')} 
          className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
          My Addresses
        </h1>

        <button 
          onClick={() => navigate('/user/addresses/add')}
          className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-all"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* --- ADDRESS LIST --- */}
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {loading && addresses.length === 0 ? (
          <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <MapPin size={32} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Addresses</h3>
            <p className="text-gray-500 mb-6">Save addresses for faster checkout.</p>
            <button 
              onClick={() => navigate('/user/addresses/add')}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-200"
            >
              Add New Address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div 
              key={addr._id}
              onClick={(e) => !addr.isDefault && handleSetDefault(addr._id, e)}
              className={`
                relative p-5 rounded-2xl border-2 transition-all duration-200 bg-white group
                ${addr.isDefault 
                  ? 'border-purple-600 shadow-md ring-1 ring-purple-100' 
                  : 'border-transparent shadow-sm hover:border-gray-200 cursor-pointer'
                }
              `}
            >
              {/* Top Row: Type Badge + Default Indicator */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                    addr.type === 'Home' ? 'bg-blue-50 text-blue-700' : 
                    addr.type === 'Work' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {addr.type}
                  </span>
                  
                  {addr.isDefault && (
                    <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                      <CheckCircle2 size={12} strokeWidth={3} /> Default
                    </span>
                  )}
                </div>
              </div>

              {/* Address Info */}
              <div className="pr-8">
                <h3 className="font-bold text-gray-900 text-base">{addr.fullName}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 && <span>, {addr.addressLine2}</span>}
                  <br />
                  {addr.city}, {addr.state} - <span className="font-semibold text-gray-900">{addr.pincode}</span>
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  +91 {addr.phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                {!addr.isDefault && (
                  <button 
                    onClick={(e) => handleSetDefault(addr._id, e)}
                    className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                
                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={(e) => handleEdit(addr._id, e)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(addr._id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;