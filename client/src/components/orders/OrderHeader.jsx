import React from 'react';
import { Search, Bell } from 'lucide-react'; // Optional Icons for Right Side

const OrderHeader = ({ title = "My Orders" }) => {
  // navigate(-1) ki ab zarurat nahi hai

  return (
    <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
      
      {/* ✅ Left Side: Only Title (No Back Arrow) */}
      <h1 className="text-xl font-extrabold text-gray-800 tracking-wide">
        {title}
      </h1>

    </div>
  );
};

export default OrderHeader;