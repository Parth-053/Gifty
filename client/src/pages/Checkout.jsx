import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import CheckoutHeader from "../components/CheckoutHeader";
import DeliveryAddressCard from "../components/DeliveryAddressCard";
import OrderItemsSummary from "../components/OrderItemsSummary";
import PriceDetails from "../components/PriceDetails";
import PaymentMethods from "../components/PaymentMethods";
import PlaceOrderBar from "../components/PlaceOrderBar";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data);
    };

    fetchCart();
  }, [token, navigate]);

  const placeOrder = async () => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const order = await res.json();
    navigate(`/order/${order._id}`);
  };

  if (!cart) return null;

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-36">
      <CheckoutHeader />

      <div className="px-4 space-y-4 mt-4">
        <DeliveryAddressCard address={cart.address} />
        <OrderItemsSummary items={cart.items} />
        <PriceDetails total={cart.totalAmount} />
        <PaymentMethods />
      </div>

      <PlaceOrderBar onPlaceOrder={placeOrder} />
    </div>
  );
};

export default Checkout;
