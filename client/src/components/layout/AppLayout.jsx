import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNavbar from './BottomNav'; // Updated Import

const AppLayout = () => {
  const location = useLocation();
  
  // Hide layouts on checkout/auth pages if needed
  const isCheckout = location.pathname.includes('/checkout');
  const isAuth = location.pathname.includes('/auth');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 pb-[80px]"> {/* Added padding-bottom for fixed navbar */}
      
      {/* 1. Top Navbar (Hide on specific pages if desired) */}
      {!isCheckout && !isAuth && <Navbar />}
      
      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-full">
        <Outlet />
      </main>

      {/* 3. New Bottom Navbar (Fixed) */}
      {!isCheckout && !isAuth && <BottomNavbar />}
    </div>
  );
};

export default AppLayout;