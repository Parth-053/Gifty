import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { logout } from "../../store/authSlice"; 

const Navbar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/auth/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      
      {/* Left: Mobile Menu Button & Brand */}
      <div className="flex items-center gap-4">
        {/* --- HAMBURGER BUTTON (Mobile Only) --- */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Page Title (Optional) */}
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Dashboard
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* FIX: Added onClick to navigate to notifications */}
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
        >
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {seller?.storeName || "Seller"}
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;