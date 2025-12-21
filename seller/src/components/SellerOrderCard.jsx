import API_URL from "../config/api";

const SellerOrderCard = ({ order, refresh }) => {
  const updateStatus = async (status) => {
    await fetch(
      `${API_URL}/api/seller/orders/${order._id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    refresh();
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Order #{order._id.slice(-6)}
        </h3>
        <select
          value={order.status}
          onChange={(e) =>
            updateStatus(e.target.value)
          }
          className="border rounded-md px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Buyer: {order.userId?.name} (
        {order.userId?.email})
      </p>

      <div className="mt-3 space-y-2">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm"
          >
            <span>
              {item.quantity} × {item.productId?.name}
            </span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right font-semibold">
        Total: ₹{order.totalAmount}
      </div>
    </div>
  );
};

export default SellerOrderCard;
