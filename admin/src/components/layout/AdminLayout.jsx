import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        
        {/* Top Navbar */}
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

export default AdminLayout;