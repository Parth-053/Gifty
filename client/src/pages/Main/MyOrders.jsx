import React, { useState } from 'react';

// ✅ Fix: Correct Import Paths
import OrderHeader from '../../components/orders/OrderHeader';
import OrderFilters from '../../components/orders/OrderFilter';
import OrderCard from '../../components/orders/OrderCard';

const ORDERS_DATA = [
  { id: '#GFT-98212', date: 'Today, 10:30 AM', status: 'Processing', productName: 'Customized Photo Mug', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200', total: 499 },
  { id: '#GFT-88321', date: 'Yesterday', status: 'Shipped', productName: 'Couple Keychains Set', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=200', total: 899 },
  { id: '#GFT-77210', date: '24 Dec 2025', status: 'Delivered', productName: 'Personalized Pillow', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=200', total: 650 },
  { id: '#GFT-66100', date: '10 Dec 2025', status: 'Cancelled', productName: 'Chocolate Hamper', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200', total: 1200 },
];

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = activeFilter === "All" 
    ? ORDERS_DATA 
    : ORDERS_DATA.filter(order => order.status === activeFilter);

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-24">
      <OrderHeader title="My Orders" />
      <OrderFilters activeFilter={activeFilter} setFilter={setActiveFilter} />

      <div className="p-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 opacity-60">
            <p className="text-sm font-bold text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;