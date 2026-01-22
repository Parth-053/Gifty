import React from 'react';
import { Search } from 'lucide-react';

const OrderHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">Track and manage your recent purchases.</p>
      </div>

      <div className="relative w-full sm:w-72">
        <input
          type="text"
          placeholder="Search by Order ID or Product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm"
        />
        <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default OrderHeader;