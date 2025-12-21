import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-2xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="h-44 w-full object-cover bg-gray-100"
        />

        {/* CUSTOMIZABLE BADGE */}
        {product.customization?.isCustomizable && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            Customizable
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium line-clamp-2">
          {product.title}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 text-sm">
          <span className="text-yellow-400">★</span>
          <span className="font-medium">
            {product.rating?.toFixed(1) || "0.0"}
          </span>
        </div>

        {/* PRICE */}
        <p className="text-purple-700 font-semibold text-base">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
