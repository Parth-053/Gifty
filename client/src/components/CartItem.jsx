const CartItem = ({ item, onRemove }) => {
  const { productId, quantity } = item;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
      {/* Image */}
      <img
        src={productId.images?.[0]}
        alt={productId.title}
        className="w-24 h-24 object-cover rounded-xl"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">
          {productId.title}
        </h3>

        {/* Customization preview */}
        {item.customizationData && (
          <p className="text-xs text-gray-500">
            {item.customizationData.text}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-purple-700">
            ₹{productId.price}
          </span>

          <span className="text-sm">Qty: {quantity}</span>
        </div>

        <button
          onClick={() => onRemove(productId._id)}
          className="text-xs text-red-500 mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
