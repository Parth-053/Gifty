import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth"; // Uses the hook we defined above
import useClickOutside from "../../hooks/useClickOutside";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth(); // Destructure logout from the hook
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      {/* Left Side: Menu & Logo Placeholder */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
          <BellIcon className="h-6 w-6" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.fullName || "Seller"}</p>
              <p className="text-xs text-gray-500">{user?.storeName || "Store"}</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 transform origin-top-right transition-all">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                to="/profile/store-settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                Store Settings
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;