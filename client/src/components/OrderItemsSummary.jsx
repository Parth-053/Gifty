const OrderItemsSummary = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">
        Order Items ({items.length})
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <img
              src={item.productId.images?.[0]}
              alt={item.productId.title}
              className="w-16 h-16 object-cover rounded-lg"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.productId.title}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold">
              ₹{item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsSummary;
