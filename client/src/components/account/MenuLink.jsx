import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const MenuLink = ({ to, icon: Icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center justify-between p-4 rounded-xl transition-all group mb-2
        ${isActive 
          ? 'bg-gray-900 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'
        }
      `}
    >
      {/* FIX: Use a render function to access isActive state for children */}
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon 
              size={20} 
              // Now passing a STRING, not a function
              className={isActive ? 'text-blue-400' : 'text-gray-400'} 
            />
            <span className="font-bold text-sm">{label}</span>
          </div>
          <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </NavLink>
  );
};

export default MenuLink;