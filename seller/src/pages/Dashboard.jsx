import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/seller/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
        />
      </div>
    </div>
  );
};

export default Dashboard;

/* =========================
   STAT CARD COMPONENT
   ========================= */
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
};
