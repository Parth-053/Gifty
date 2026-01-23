import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  BanknotesIcon, 
  TagIcon, 
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  MegaphoneIcon,
  ArrowPathRoundedSquareIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
        { name: "Analytics", icon: ChartBarIcon, path: "/analytics" },
      ]
    },
    {
      title: "Marketplace",
      items: [
        { name: "Products", icon: ShoppingBagIcon, path: "/products" },
        { name: "Product Approvals", icon: ClipboardDocumentCheckIcon, path: "/products/approvals" },
        { name: "Categories", icon: TagIcon, path: "/categories" },
      ]
    },
    {
      title: "Orders & Returns",
      items: [
        { name: "Orders", icon: ClipboardDocumentCheckIcon, path: "/orders" },
        { name: "Returns", icon: ArrowPathRoundedSquareIcon, path: "/returns" },
      ]
    },
    {
      title: "Users & Sellers",
      items: [
        { name: "Sellers", icon: BuildingStorefrontIcon, path: "/sellers" },
        { name: "Seller Approvals", icon: ClipboardDocumentCheckIcon, path: "/sellers/approvals" },
        { name: "Users", icon: UsersIcon, path: "/users" },
      ]
    },
    {
      title: "Finance",
      items: [
        { name: "Transactions", icon: BanknotesIcon, path: "/finance/transactions" },
        { name: "Payouts", icon: BanknotesIcon, path: "/finance/payouts" },
      ]
    },
    {
      title: "Marketing",
      items: [
        { name: "Banners", icon: MegaphoneIcon, path: "/banners" },
        { name: "Coupons", icon: TagIcon, path: "/coupons" },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto z-10 pb-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-2xl font-bold text-indigo-600">Gifty Admin</span>
      </div>

      <nav className="p-4 space-y-8">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;