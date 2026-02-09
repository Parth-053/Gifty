import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  ChartBarIcon, 
  CurrencyRupeeIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";

const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
  { name: "Products", href: "/products", icon: CubeIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Finance", href: "/finance", icon: CurrencyRupeeIcon },
];

const SECONDARY_NAV = [
  { name: "Settings", href: "/profile", icon: Cog6ToothIcon },
  { name: "Support", href: "/support", icon: QuestionMarkCircleIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const NavItem = ({ item }) => {
    const isActive = location.pathname.startsWith(item.href);
    return (
      <Link
        to={item.href}
        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors mx-2 mb-1 ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <item.icon
          className={`mr-3 h-5 w-5 flex-shrink-0 ${
            isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
          }`}
        />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
             <span className="text-2xl font-bold text-indigo-600">Gifty</span>
             <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Seller</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 space-y-1">
            {NAVIGATION.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}

            <div className="pt-6 pb-2 px-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account
              </p>
            </div>
            
            {SECONDARY_NAV.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;