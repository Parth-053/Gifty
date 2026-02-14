import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAddresses } from '../../store/addressSlice';

const TopHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: addresses, selectedId } = useSelector((state) => state.addresses);

  useEffect(() => {
    if (user) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, user]);

  const activeAddress = addresses.find(addr => addr._id === selectedId) 
                        || addresses.find(addr => addr.isDefault) 
                        || addresses[0];

  return (
    <div className="bg-white py-2 px-4 shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* --- Location Bar --- */}
        <div className="flex items-center gap-3 max-w-[70%]">
          <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-purple-600" />
          </div>
          
          <div className="flex flex-col justify-center min-w-0 overflow-hidden">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-0.5">
              Delivering to
            </span>
            
            <Link to="/user/addresses" className="flex items-center gap-1 group cursor-pointer">
              <span className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate block max-w-[200px] sm:max-w-sm">
                {activeAddress 
                  ? (
                      <>
                        <span className="uppercase text-purple-600 mr-1.5 text-[10px] font-extrabold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 align-middle">
                          {activeAddress.type || "HOME"}
                        </span>
                        <span className="align-middle">
                          {/* Prefer addressLine1, fallback to city if empty */}
                          {activeAddress.addressLine1 || activeAddress.city} 
                          {activeAddress.pincode ? ` - ${activeAddress.pincode}` : ''}
                        </span>
                      </>
                    )
                  : "Add Address"
                }
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-purple-600 transition-colors shrink-0" />
            </Link>
          </div>
        </div>

        {/* --- Right Actions --- */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="relative p-2 rounded-full hover:bg-gray-50 transition-all">
            <Bell size={22} className="text-gray-700" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default TopHeader;