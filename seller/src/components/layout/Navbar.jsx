import React from 'react';
import { Menu, Bell, Search, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; //

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth(); //

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-50 px-3 py-2 rounded-xl border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all w-72">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Search orders, products..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none">{user?.fullName || 'Seller'}</p>
            <p className="text-[10px] font-bold text-green-600 mt-1 uppercase tracking-tighter">Verified Store</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black border-2 border-white shadow-sm">
             {user?.fullName?.charAt(0) || <User size={20}/>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;