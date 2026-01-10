import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Calendar, User, Package, ChevronRight, Download } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const OrderList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy Data
  const orders = [
    { id: '#ORD-7829', customer: 'Amit Sharma', date: 'Oct 24, 2025', items: 2, total: 998, status: 'Pending', payment: 'COD' },
    { id: '#ORD-7828', customer: 'Priya Singh', date: 'Oct 23, 2025', items: 1, total: 1299, status: 'Shipped', payment: 'Paid' },
    { id: '#ORD-7827', customer: 'Rahul Verma', date: 'Oct 22, 2025', items: 3, total: 699, status: 'Delivered', payment: 'Paid' },
    { id: '#ORD-7826', customer: 'Sneha Gupta', date: 'Oct 21, 2025', items: 1, total: 899, status: 'Cancelled', payment: 'Refunded' },
    { id: '#ORD-7825', customer: 'Vikram Malhotra', date: 'Oct 20, 2025', items: 5, total: 2499, status: 'Processing', payment: 'Paid' },
  ];

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">Manage and track customer orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
           <Download size={18} /> Export Orders
        </button>
      </div>

      {/* 2. Tabs & Search */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
         
         {/* Status Tabs (Scrollable on mobile) */}
         <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {tabs.map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors
                   ${activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 {tab}
               </button>
            ))}
         </div>

         {/* Search Bar */}
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full font-medium text-gray-700"
            />
         </div>
      </div>

      {/* 3. Orders List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800 text-sm">{order.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{order.date}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.customer}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{order.payment}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">₹{order.total}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="py-8 text-center text-gray-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                className="p-4 active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{order.id}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                       <Calendar size={10} /> {order.date}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                       <User size={12} /> {order.customer}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                       <Package size={12} /> {order.items} Items
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-extrabold text-gray-900">₹{order.total}</span>
                     <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">No orders found.</div>
          )}
        </div>

      </div>

      <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
    </div>
  );
};

export default OrderList;