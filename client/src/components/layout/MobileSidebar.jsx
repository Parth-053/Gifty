import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X, ChevronRight, Heart, Package, LogOut, HelpCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const MobileSidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user, logout } = useAuth();

  const handleClose = () => dispatch(toggleSidebar());

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[60] shadow-2xl 
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Hello,</p>
                <p className="text-sm text-gray-600 truncate max-w-[140px]">{user?.name}</p>
              </div>
            </div>
          ) : (
            <Link to="/auth/login" onClick={handleClose} className="font-bold text-lg text-gray-900">
              Welcome, <span className="text-blue-600">Guest</span>
            </Link>
          )}
          <button onClick={handleClose} className="p-1 bg-white rounded-full text-gray-500 shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 ml-2">Menu</p>
          
          <MenuItem to="/" icon={Package} label="All Products" onClick={handleClose} />
          <MenuItem to="/user/wishlist" icon={Heart} label="My Wishlist" onClick={handleClose} />
          <MenuItem to="/support" icon={HelpCircle} label="Help Center" onClick={handleClose} />

          {!isAuthenticated && (
             <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <p className="text-sm font-bold text-blue-800 mb-2">Become a member</p>
                <p className="text-xs text-blue-600 mb-3">Join us for exclusive offers and faster checkout.</p>
                <Link 
                  to="/auth/register" 
                  onClick={handleClose}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-bold"
                >
                  Register Now
                </Link>
             </div>
          )}

          {isAuthenticated && (
            <button 
              onClick={() => { logout(); handleClose(); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl mt-4"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

const MenuItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center justify-between px-4 py-3 rounded-xl transition-all
      ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}
    `}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </div>
    <ChevronRight size={16} className="opacity-30" />
  </NavLink>
);

export default MobileSidebar;