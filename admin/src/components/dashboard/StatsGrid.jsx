import React from "react";
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ArchiveBoxIcon 
} from "@heroicons/react/24/outline";
import StatsCard from "../common/StatsCard";
import formatCurrency from "../../utils/formatCurrency";

const StatsGrid = ({ stats, loading }) => {
  // Safe defaults to prevent crashes if backend data is missing
  const data = stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={CurrencyRupeeIcon}
        color="green"
      />
      <StatsCard
        title="Total Orders"
        value={data.totalOrders}
        icon={ShoppingBagIcon}
        color="blue"
      />
      <StatsCard
        title="Total Users"
        value={data.totalUsers}
        icon={UsersIcon}
        color="purple"
      />
      <StatsCard
        title="Total Products"
        value={data.totalProducts}
        icon={ArchiveBoxIcon}
        color="orange"
      />
    </div>
  );
};

export default StatsGrid;