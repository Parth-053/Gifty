import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import CartHeader from "../components/CartHeader";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import BottomNavbar from "../components/BottomNavbar";

const Cart = () => {
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

  const removeItem = async (productId) => {
    await fetch(`${API_URL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => item.productId._id !== productId
      ),
    }));
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF7ED]">
        <CartHeader />
        <p className="text-center mt-20 text-gray-500">
          Your cart is empty
        </p>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      <CartHeader />

      <div className="px-4 mt-4 space-y-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.productId._id}
            item={item}
            onRemove={removeItem}
          />
        ))}
      </div>

      <CartSummary items={cart.items} />

      <BottomNavbar />
    </div>
  );
};

export default Cart;
