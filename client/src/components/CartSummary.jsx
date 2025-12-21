import { useNavigate } from "react-router-dom";

const CartSummary = ({ items }) => {
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) =>
      sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-14 left-0 right-0 bg-white p-4 shadow-lg">
      <div className="flex justify-between mb-3 font-semibold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
