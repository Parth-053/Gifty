import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL  from "../config/api";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/seller/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((o) => o._id === id);
        setOrder(found);
      });
  }, [id]);

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Order Details
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Total:</b> ₹{order.totalAmount}</p>

        <hr className="my-3" />

        <h3 className="font-semibold mb-2">
          Items
        </h3>

        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>
              {item.quantity} × {item.productId?.name}
            </span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
