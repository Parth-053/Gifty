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
  XMarkIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Inventory", href: "/products", icon: CubeIcon },
    { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
    { 
      name: "Finance", 
      href: "/finance/transactions", // Default to transactions
      icon: BanknotesIcon,
      subItems: [
        { name: "Transactions", href: "/finance/transactions" },
        { name: "Payouts", href: "/finance/payouts" }
      ]
    },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { 
      name: "Settings", 
      href: "/profile", 
      icon: UserCircleIcon,
      subItems: [
        { name: "Profile", href: "/profile" },
        { name: "Store Settings", href: "/settings/store" },
        { name: "Bank Details", href: "/settings/bank" }
      ]
    },
    { name: "Support", href: "/support", icon: LifebuoyIcon },
  ];

  // Helper to check if a link or its children are active
  const isActiveLink = (item) => {
    if (item.href === location.pathname) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.href === location.pathname);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">Gifty Seller</h1>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActiveLink(item)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActiveLink(item) ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600"
                  }`}
                />
                {item.name}
              </NavLink>

              {/* Sub-items render */}
              {item.subItems && isActiveLink(item) && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-indigo-100 pl-2">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.name}
                      to={sub.href}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-xs font-medium rounded-md ${
                          isActive
                            ? "text-indigo-600 bg-white"
                            : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
             <NavLink
                to="/legal/terms"
                className="group flex items-center px-3 py-2 text-xs font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <DocumentTextIcon className="mr-3 h-4 w-4 text-gray-400" />
                Legal & Policies
              </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;