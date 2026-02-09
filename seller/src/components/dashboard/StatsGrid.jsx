import React from 'react';
import StatsCard from './StatsCard';
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const StatsGrid = ({ stats }) => {
  if (!stats) return null;

  // Map backend data to UI cards
  const data = [
    {
      title: "Total Revenue",
      value: `₹${stats.revenue?.value?.toLocaleString() || 0}`,
      growth: stats.revenue?.growth || 0,
      isPositive: stats.revenue?.isPositive,
      icon: CurrencyRupeeIcon,
      color: "green"
    },
    {
      title: "Total Orders",
      value: stats.orders?.value || 0,
      growth: stats.orders?.growth || 0,
      isPositive: stats.orders?.isPositive,
      icon: ShoppingBagIcon,
      color: "blue"
    },
    {
      title: "Active Products",
      value: stats.products?.value || 0,
      growth: stats.products?.growth || 0,
      isPositive: stats.products?.isPositive,
      icon: CubeIcon,
      color: "orange"
    },
    {
      title: "Total Customers",
      value: stats.customers?.value || 0,
      growth: stats.customers?.growth || 0,
      isPositive: stats.customers?.isPositive,
      icon: UserGroupIcon,
      color: "purple"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <StatsCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StatsGrid;