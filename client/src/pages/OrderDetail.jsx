import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import OrderDetailHeader from "../components/OrderDetailHeader";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import OrderedItems from "../components/OrderedItems";
import DeliveryAddressSummary from "../components/DeliveryAddressSummary";
import PaymentSummary from "../components/PaymentSummary";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrder(data);
    };

    fetchOrder();
  }, [id, token, navigate]);

  if (!order) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-10">
      <OrderDetailHeader />

      <div className="px-4 mt-4 space-y-4">
        <OrderStatusTimeline status={order.status} />
        <OrderedItems items={order.items} />
        <DeliveryAddressSummary address={order.address} />
        <PaymentSummary order={order} />
      </div>
    </div>
  );
};

export default OrderDetail;
