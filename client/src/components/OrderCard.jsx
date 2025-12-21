import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/order/${order._id}`)}
      className="bg-white p-4 rounded-xl shadow-sm cursor-pointer"
    >
      <p className="font-semibold">
        Order #{order._id.slice(-6).toUpperCase()}
      </p>

      <p className="text-sm text-gray-500 capitalize">
        {order.status}
      </p>

      <p className="text-sm font-medium mt-1">
        Total: ₹{order.totalAmount}
      </p>
    </div>
  );
};

export default OrderCard;
