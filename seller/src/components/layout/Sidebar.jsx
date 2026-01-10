import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart2, 
  Settings, 
  LogOut, 
  X, 
  Store 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    
    // ✅ CORRECTED PATHS:
    { name: 'Store Profile', path: '/profile/settings', icon: Store }, // Points to StoreSettings.jsx (Logo, Store Name)
    { name: 'Settings', path: '/profile/me', icon: Settings },         // Points to SellerProfile.jsx (Personal Info, Password)
  ];

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    navigate('/auth/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Seller<span className="text-blue-600">App</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-130px)] custom-scrollbar">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions (Logout) */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;