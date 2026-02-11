import React from "react";
import { Link } from "react-router-dom";
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon
} from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth"; 

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth(); 

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      
      {/* Left: Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none p-2 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Notifications */}
        <Link 
          to="/notifications" 
          className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 relative transition-colors"
          title="Notifications"
        >
          <BellIcon className="h-6 w-6" />
          {/* Optional Unread Badge */}
          {/* <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span> */}
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        {/* Profile Link (Direct Navigation) */}
        <Link
          to="/profile"
          className="flex items-center gap-2 focus:outline-none group p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase shrink-0">
            {user?.storeName?.charAt(0) || user?.fullName?.charAt(0) || <UserCircleIcon className="h-8 w-8 text-gray-400" />}
          </div>
          
          <div className="hidden md:block text-left pr-2">
            <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
              {user?.fullName || "Seller"}
            </p>
            <p className="text-xs text-gray-500">{user?.storeName || "Store"}</p>
          </div>
        </Link>

      </div>
    </header>
  );
};

export default Navbar;