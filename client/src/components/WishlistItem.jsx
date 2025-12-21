const WishlistItem = ({ product, onRemove }) => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
      {/* Image */}
      <img
        src={product.images?.[0]}
        alt={product.title}
        className="w-24 h-24 object-cover rounded-xl"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-purple-700">
            ₹{product.price}
          </span>

          <button
            onClick={() => onRemove(product._id)}
            className="text-xs text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
