import { useEffect, useState } from "react";
import API_URL from "../config/api";
import AnalyticsChart from "../components/AnalyticsChart";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/seller/analytics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }

        setAnalytics(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6 text-red-500">No analytics data</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Seller Analytics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SummaryCard
          title="Total Earnings"
          value={`₹${analytics.totalEarnings}`}
        />
        <SummaryCard
          title="Total Orders"
          value={analytics.totalOrders}
        />
      </div>

      {/* Chart */}
      <AnalyticsChart
        monthlyRevenue={analytics.monthlyRevenue}
      />
    </div>
  );
};

export default Analytics;

/* =========================
   SUMMARY CARD
   ========================= */
const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
};
