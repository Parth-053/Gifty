const OrderedItems = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-3">
        Items in this Order
      </h2>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <img
              src={item.productId.images?.[0]}
              alt=""
              className="w-20 h-20 object-cover rounded-lg"
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

export default OrderedItems;
