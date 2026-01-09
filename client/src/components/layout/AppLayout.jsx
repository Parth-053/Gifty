import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

const AppLayout = () => {
  return (
    <div className="bg-[#F9F9F9] min-h-screen text-gray-800 font-sans">
      
     
      <main className="pb-24 max-w-md mx-auto md:max-w-full min-h-screen"> 
        <Outlet />
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default AppLayout;