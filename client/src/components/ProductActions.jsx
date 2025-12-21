import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const ProductActions = ({ productId }) => {
  const navigate = useNavigate();

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    await fetch(`${API_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    navigate("/cart");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 shadow-lg">
      <button
        onClick={addToCart}
        className="flex-1 border border-purple-700 text-purple-700 py-3 rounded-xl font-semibold"
      >
        Add to Cart
      </button>

      <button
        onClick={() => navigate("/cart")}
        className="flex-1 bg-purple-700 text-white py-3 rounded-xl font-semibold"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductActions;
