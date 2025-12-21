import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import WishlistHeader from "../components/WishlistHeader";
import WishlistItem from "../components/WishlistItem";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      const res = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setItems(data);
    };

    fetchWishlist();
  }, [token, navigate]);

  const removeItem = async (productId) => {
    await fetch(`${API_URL}/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <WishlistHeader />

      <div className="px-4 mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            Wishlist is empty
          </p>
        ) : (
          items.map((item) => (
            <WishlistItem
              key={item.product._id}
              product={item.product}
              onRemove={removeItem}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
