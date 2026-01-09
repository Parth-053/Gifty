import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuLink = ({ icon: Icon, label, subLabel, to, isDestructive }) => {
  // If 'to' prop is present, make it a Link, else a Button (for logout)
  const Wrapper = to ? Link : 'button';

  return (
    <Wrapper 
      to={to} 
      className={`
        w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-none active:bg-gray-50 transition-colors
        ${isDestructive ? 'text-red-500' : 'text-gray-700'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`
          p-2 rounded-lg 
          ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}
        `}>
          <Icon size={18} strokeWidth={2} />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-semibold">{label}</h4>
          {subLabel && <p className="text-[10px] text-gray-400">{subLabel}</p>}
        </div>
      </div>
      
      {!isDestructive && <ChevronRight size={18} className="text-gray-300" />}
    </Wrapper>
  );
};

export default MenuLink;