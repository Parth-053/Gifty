import React from 'react';
import { ShoppingBag, Heart, Ticket, Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';

const StatsBar = () => {
  // Get real data lengths from Redux
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  // Assuming orders are fetched in orderSlice, otherwise default to 0
  const ordersCount = useSelector((state) => state.orders?.totalOrders || 0);

  const stats = [
    { label: 'Total Orders', value: ordersCount, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Wishlist', value: wishlistCount, icon: Heart, color: 'bg-pink-50 text-pink-600' },
    { label: 'Coupons', value: '2', icon: Ticket, color: 'bg-purple-50 text-purple-600' }, // Dummy for now
    { label: 'Wallet', value: '₹0', icon: Wallet, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs font-bold text-gray-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;