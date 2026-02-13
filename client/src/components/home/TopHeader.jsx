import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Bell, ChevronDown } from 'lucide-react';
import { fetchAddresses } from '../../store/addressSlice';
import { Link } from 'react-router-dom';

const TopHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: addresses } = useSelector((state) => state.addresses);

  useEffect(() => {
    if (user) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, user]);

  // Logic: Find the address marked as default. 
  // If no default exists (rare), fallback to the first one.
  const defaultAddress = addresses?.find(addr => addr.isDefault) || addresses?.[0];

  return (
    <div className="bg-white py-2 px-4 shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* --- LOCATION BAR --- */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-purple-600" />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-0.5">
              Delivering to
            </span>
            
            <Link to="/user/addresses" className="flex items-center gap-1 group cursor-pointer">
              <span className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate max-w-[150px] sm:max-w-xs">
                {defaultAddress 
                  ? `${defaultAddress.city} - ${defaultAddress.pincode}` 
                  : "Add Address"
                }
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>
        </div>

        {/* --- RIGHT ICONS --- */}
        <div className="flex items-center gap-3">
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