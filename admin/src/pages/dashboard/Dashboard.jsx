import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchSalesGraph } from "../../store/dashboardSlice";
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox } from "react-icons/fi";
import Loader from "../../components/common/Loader";
import SalesChart from "../../components/charts/SalesChart"; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, graphData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchSalesGraph());
  }, [dispatch]);

  if (loading) return <Loader />;

  const cards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: <FiDollarSign />, color: "bg-green-100 text-green-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingBag />, color: "bg-blue-100 text-blue-600" },
    { title: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "bg-purple-100 text-purple-600" },
    { title: "Active Sellers", value: stats.totalSellers, icon: <FiBox />, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${card.color} text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Sales Analytics</h2>
        <div className="h-80">
           {/* Pass real data to chart */}
           <SalesChart data={graphData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;