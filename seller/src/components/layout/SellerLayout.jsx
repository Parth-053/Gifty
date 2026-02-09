import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// FIX: Accept 'children' prop to render the page content passed from SellerRoutes
const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Wrapper */}
      {/* lg:pl-64 reserves space for the fixed sidebar on large screens */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64 w-full">
        
        {/* Navbar - Fixed at top */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          {/* FIX: Render children instead of Outlet */}
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default SellerLayout;