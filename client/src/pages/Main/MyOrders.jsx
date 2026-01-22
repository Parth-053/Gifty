import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PackageX } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import OrderHeader from '../../components/orders/OrderHeader';
import OrderFilter from '../../components/orders/OrderFilter';
import OrderCard from '../../components/orders/OrderCard';
import Loader from '../../components/common/Loader';

// Actions
import { fetchOrders } from '../../store/orderSlice';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch real data on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Client-side filtering (efficient for user order lists which are usually small)
  const filteredOrders = orders.filter(order => {
    // Status Filter
    const matchesFilter = filter === 'all' || 
      (order.status && order.status.toLowerCase() === filter.toLowerCase());
    
    // Search Filter (ID or Product Name)
    const matchesSearch = 
      order._id.toLowerCase().includes(search.toLowerCase()) || 
      order.items.some(i => i.product?.name?.toLowerCase().includes(search.toLowerCase()));
      
    return matchesFilter && matchesSearch;
  });

  if (loading && orders.length === 0) return <Loader fullScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* 1. Header & Search */}
      <OrderHeader searchQuery={search} setSearchQuery={setSearch} />

      {/* 2. Status Filters */}
      <div className="mb-6">
        <OrderFilter activeFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* 3. Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <PackageX size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search || filter !== 'all' ? "Try adjusting your filters." : "Looks like you haven't placed any orders yet."}
            </p>
            {(search || filter !== 'all') ? (
               <button onClick={() => {setSearch(''); setFilter('all');}} className="text-blue-600 font-bold text-sm">Clear Filters</button>
            ) : (
               <Link to="/" className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">
                 Start Shopping
               </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;