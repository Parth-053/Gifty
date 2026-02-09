import React from "react";
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ArchiveBoxIcon 
} from "@heroicons/react/24/outline";
import StatsCard from "../common/StatsCard";
import formatCurrency from "../../utils/formatCurrency";

const StatsGrid = ({ stats, loading, timeRange }) => {
  const data = stats || {
    revenue: { value: 0, percentage: 0, isPositive: true },
    orders: { value: 0, percentage: 0, isPositive: true },
    users: { value: 0, percentage: 0, isPositive: true },
    products: { value: 0, percentage: 0, isPositive: true }
  };

  // Determine the label based on the filter
  const getTrendLabel = () => {
    switch (timeRange) {
      case "today": return "from yesterday";
      case "yesterday": return "from day before";
      case "week": return "from last week";
      case "year": return "from last year";
      case "all": return ""; 
      default: return "from last period";
    }
  };

  const trendLabel = getTrendLabel();
  const showTrend = timeRange !== "all";

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(data.revenue?.value || 0)}
        icon={CurrencyRupeeIcon}
        color="green"
        trend={showTrend ? {
          value: data.revenue?.percentage || 0,
          isPositive: data.revenue?.isPositive,
          label: trendLabel
        } : null}
      />
      <StatsCard
        title="Total Orders"
        value={data.orders?.value || 0}
        icon={ShoppingBagIcon}
        color="blue"
        trend={showTrend ? {
          value: data.orders?.percentage || 0,
          isPositive: data.orders?.isPositive,
          label: trendLabel
        } : null}
      />
      <StatsCard
        title="Total Users"
        value={data.users?.value || 0}
        icon={UsersIcon}
        color="purple"
        trend={showTrend ? {
          value: data.users?.percentage || 0,
          isPositive: data.users?.isPositive,
          label: trendLabel
        } : null}
      />
      <StatsCard
        title="Total Products"
        value={data.products?.value || 0}
        icon={ArchiveBoxIcon}
        color="orange"
        trend={showTrend ? {
          value: data.products?.percentage || 0,
          isPositive: data.products?.isPositive,
          label: trendLabel
        } : null}
      />
    </div>
  );
};

export default StatsGrid;