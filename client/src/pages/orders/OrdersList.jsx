import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import OrderTable from '../../components/tables/OrderTable';
import Pagination from '../../components/common/Pagination';

const OrdersList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Dummy Data
  const orders = [
    { id: '#ORD-7829', date: 'Oct 24, 2025', customer: 'Amit Sharma', total: 998, status: 'Pending' },
    { id: '#ORD-7828', date: 'Oct 23, 2025', customer: 'Priya Singh', total: 1299, status: 'Shipped' },
    { id: '#ORD-7827', date: 'Oct 22, 2025', customer: 'Rahul Verma', total: 699, status: 'Delivered' },
    { id: '#ORD-7826', date: 'Oct 21, 2025', customer: 'Sneha Gupta', total: 899, status: 'Cancelled' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">Track and manage customer orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
           <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full sm:w-80 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full font-medium"
            />
         </div>
         <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-600 outline-none cursor-pointer border border-transparent hover:bg-gray-100"
         >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
         </select>
      </div>

      {/* Table */}
      <OrderTable 
        orders={filteredOrders} 
        onView={(id) => navigate(`/orders/${id.replace('#', '')}`)} 
      />
      
      <Pagination currentPage={1} totalPages={5} onPageChange={()=>{}} />
    </div>
  );
};

export default OrdersList;