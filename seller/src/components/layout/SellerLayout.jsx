import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const SellerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        
        {/* Top Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {/* Outlet renders the child routes (Dashboard, Products, etc.) */}
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

export default SellerLayout;