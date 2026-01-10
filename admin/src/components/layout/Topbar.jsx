import React from 'react';
import { Menu, Bell, Search, ChevronDown, User } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
      
      {/* Left: Menu Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Global Search */}
        <div className="hidden md:flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all w-72">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">Super Admin</p>
            <p className="text-[10px] text-gray-500 mt-1">Administrator</p>
          </div>
          <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm group-hover:shadow-md transition-all">
            <User size={18} />
          </div>
          <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
        </div>

      </div>
    </header>
  );
};

export default Topbar;