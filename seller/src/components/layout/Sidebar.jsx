import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingBagIcon, 
  BanknotesIcon, 
  ChartBarIcon, 
  UserCircleIcon, 
  LifebuoyIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Products", href: "/products", icon: CubeIcon },
    { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
    { name: "Finance", href: "/finance", icon: BanknotesIcon },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { name: "Profile", href: "/profile", icon: UserCircleIcon },
    { name: "Support", href: "/support", icon: LifebuoyIcon },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* --- MOBILE OVERLAY (Click outside to close) --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      {/* 1. fixed inset-y-0 left-0: Sticks to left side
          2. z-50: Always on top
          3. transform transition-transform: Smooth animation
          4. lg:translate-x-0: ALWAYS show on Desktop (Large Screens)
          5. -translate-x-full: Hide on mobile by default
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Header (Logo + Close Button) */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                G
              </div>
              <span className="text-xl font-bold text-gray-800">Seller Panel</span>
            </div>
            
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar} // Close sidebar on mobile when clicked
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer User Info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">My Store</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;