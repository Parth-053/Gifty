import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

const AdminLayout = () => {
  // 1. Initialize State for Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> 
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
 
      <Topbar setSidebarOpen={setIsSidebarOpen} />
 
      <main className="flex-1 pt-20 p-6 lg:ml-64 transition-all duration-300 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;