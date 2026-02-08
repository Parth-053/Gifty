import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. The Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 2. Main Content Wrapper */}
      {/* lg:pl-64 is CRITICAL. It pushes content to the right on Desktop so Sidebar doesn't cover it */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default SellerLayout;