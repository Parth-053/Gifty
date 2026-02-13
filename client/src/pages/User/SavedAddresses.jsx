import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin, ArrowLeft, CheckCircle2, Trash2, Edit2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAddresses, deleteAddress, setDefaultAddress, selectAddress } from '../../store/addressSlice';

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: addresses, selectedId, loading } = useSelector((state) => state.addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  // Only updates the database flag
  const handleSetDefault = (id, e) => {
    e.stopPropagation();
    dispatch(setDefaultAddress(id));
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/user/addresses/edit/${id}`);
  };

  // Updates the UI selection for Home Page
  const handleSelect = (id) => {
    dispatch(selectAddress(id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate(-1)} // Goes back to previous page
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

      {/* Address List */}
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {loading && addresses.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <MapPin size={32} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Addresses</h3>
            <p className="text-gray-500 mb-6">Add an address to get started.</p>
            <button onClick={() => navigate('/user/addresses/add')} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">
              Add Address
            </button>
          </div>
        ) : (
          addresses.map((addr) => {
            const isSelected = selectedId === addr._id;
            return (
              <div 
                key={addr._id}
                onClick={() => handleSelect(addr._id)}
                className={`
                  relative p-5 rounded-2xl border-2 transition-all duration-200 bg-white cursor-pointer
                  ${isSelected 
                    ? 'border-purple-600 shadow-md ring-1 ring-purple-100' 
                    : 'border-transparent shadow-sm hover:border-gray-200'
                  }
                `}
              >
                {/* Labels Row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {/* Home/Work Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                      addr.type === 'Home' ? 'bg-blue-50 text-blue-700' : 
                      addr.type === 'Work' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {addr.type}
                    </span>
                    
                    {/* Default Badge */}
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="pr-2">
                  <h3 className="font-bold text-gray-900 text-base">{addr.fullName}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}
                    <br />
                    {addr.city}, {addr.state} - <span className="font-semibold text-gray-900">{addr.pincode}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2 font-medium">+91 {addr.phone}</p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  
                  {/* Set Default Button (Only shows if not already default) */}
                  {!addr.isDefault ? (
                    <button 
                      onClick={(e) => handleSetDefault(addr._id, e)}
                      className="text-xs font-bold text-gray-500 hover:text-purple-600 px-2 py-1 -ml-2 rounded-lg transition-colors"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-gray-300 italic">Primary Address</span>
                  )}
                  
                  {/* Edit/Delete */}
                  <div className="flex items-center gap-2">
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;