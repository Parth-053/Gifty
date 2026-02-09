import React from "react";
import { NavLink } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  Cog6ToothIcon,
  TagIcon,
  PhotoIcon,
  TicketIcon,
  ArrowPathIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { name: "Products", href: "/products", icon: ShoppingBagIcon },
    { name: "Categories", href: "/categories", icon: TagIcon },
    { name: "Orders", href: "/orders", icon: ClipboardDocumentListIcon },
    { name: "Returns", href: "/returns", icon: ArrowPathIcon }, 
    { name: "Sellers", href: "/sellers", icon: UsersIcon },
    { name: "Users", href: "/users", icon: UsersIcon },
    { name: "Finance", href: "/finance/transactions", icon: BanknotesIcon },
    { name: "Banners", href: "/banners", icon: PhotoIcon },
    { name: "Coupons", href: "/coupons", icon: TicketIcon }, 
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop - Closes sidebar when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-indigo-600">Gifty Admin</h1>
          {/* Close Button for Mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`
              }
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  window.location.pathname.startsWith(item.href) // Simple active check fallback
                    ? "text-indigo-600"
                    : "text-gray-400 group-hover:text-indigo-600"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;