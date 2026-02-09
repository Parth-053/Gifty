import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice"; 
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon,
  UserCircleIcon 
} from "@heroicons/react/24/outline";

// Ensure 'setSidebarOpen' is destructured from props
const Topbar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Safe check for notifications
  const notificationCount = useSelector((state) => state.notifications?.unreadCount || 0);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 lg:pl-64 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Toggle & Search */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Triggers the function passed from AdminLayout */}
            <button
              type="button"
              className="lg:hidden -m-2.5 p-2.5 text-gray-700 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Global Search Bar (Hidden on small mobile) */}
            <div className="hidden md:flex items-center max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Global Search..."
                />
              </div>
            </div>
          </div>

          {/* Right Section: Notifications & Profile */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            
            {/* Notification Bell */}
            <button 
              type="button" 
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
              onClick={() => navigate("/notifications")} // Correct Path
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {notificationCount}
                </span>
              )}
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
                {user?.photoURL ? (
                    <img
                        className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                        src={user.photoURL}
                        alt=""
                    />
                ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
                
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {user?.displayName || "Admin"}
                  </span>
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                   <button
                    onClick={() => navigate("/settings")}
                    className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 text-left"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 text-left"
                  >
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

export default Topbar;