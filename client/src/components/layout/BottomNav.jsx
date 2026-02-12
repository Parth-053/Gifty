import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Wand2, Package, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Shop', icon: Grid, path: '/categories' },
    { 
      name: 'Customize', 
      icon: Wand2, 
      path: '/customize', 
      isSpecial: true 
    },
    { name: 'Orders', icon: Package, path: '/my-orders' }, 
    { name: 'Profile', icon: User, path: '/user/profile' }, 
  ];

  return (
    /* Removed 'lg:hidden' so it shows on all screens */
    <div className="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100 h-[65px]">
      
      <div className="flex justify-between items-center px-6 h-full pb-1">
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            // Fix: Removed unused isActive parameter from className
            className={`
              relative flex flex-col items-center justify-center w-full h-full
              ${item.isSpecial ? '' : ''} 
            `}
          >
            {({ isActive }) => (
              <>
                {/* ✨ Special Center Button (Customize) */}
                {item.isSpecial ? (
                  <>
                    <div className={`
                      absolute -top-6 left-1/2 transform -translate-x-1/2
                      w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                      ring-4 ring-white
                      transition-transform duration-200 active:scale-95
                      bg-gradient-to-r from-blue-600 to-purple-600
                    `}>
                      <item.icon size={20} color="white" strokeWidth={2.5} />
                    </div>

                    {/* Text Label */}
                    <span className={`text-[10px] font-semibold mt-7 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.name}
                    </span>
                  </>
                ) : (
                  // 🏠 Normal Icons
                  <div className="flex flex-col items-center gap-1">
                    <item.icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                    />
                    <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                      {item.name}
                    </span>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default BottomNav;