import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  Users, 
  Store, 
  ShoppingCart, 
  CreditCard, 
  Image, 
  BarChart2, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Sellers', path: '/sellers', icon: Store },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Banners', path: '/banners', icon: Image },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Clear admin token logic
    localStorage.removeItem('adminToken');
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
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-130px)] custom-scrollbar">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions (Logout) */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-800 bg-gray-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
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