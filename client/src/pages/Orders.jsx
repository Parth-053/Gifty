import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import OrdersHeader from "../components/OrdersHeader";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      const res = await fetch(`${API_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    };

    fetchOrders();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <OrdersHeader />

      <div className="px-4 mt-4 space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No orders found
          </p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
