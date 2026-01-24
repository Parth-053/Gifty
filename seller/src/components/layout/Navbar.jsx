import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSeller } from "../../store/authSlice";
import { 
  Bars3Icon, 
  BellIcon, 
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutSeller());
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:pl-64">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Menu Button */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-md"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            
            {/* Notification Bell (Optional) */}
            <button className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="-m-1.5 flex items-center p-1.5"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {seller?.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                    src={seller.avatar}
                    alt=""
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
                
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {seller?.fullName || "Seller"}
                  </span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium truncate">{seller?.storeName}</p>
                    <p className="text-xs text-gray-500 truncate">{seller?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    Your Profile
                  </button>
                  
                  <button
                    onClick={() => { navigate("/settings/store"); setIsProfileOpen(false); }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    Store Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;