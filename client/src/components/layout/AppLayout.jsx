import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import Navbar from './Navbar';

const AppLayout = () => {
  const location = useLocation();

  // List of routes where we want the BottomNav visible, but NO Top Navbar.
  // (Because these pages have their own specific headers)
  const noNavbarRoutes = [
    '/categories',
    '/customize',
    '/my-orders',
    '/user' // Covers /user/profile, /user/orders, etc.
  ];

  // Check if current path starts with any of the routes above
  const shouldHideNavbar = noNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditionally render Top Navbar */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* Main Content (Always has padding for bottom nav) */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Bottom Nav is always visible in this Layout */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;