import { useNavigate } from "react-router-dom";

const SearchResultCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
    >
      <img
        src={product.images?.[0]}
        alt={product.title}
        className="h-32 w-full object-cover"
      />

      <div className="p-2">
        <h3 className="text-sm font-medium">
          {product.title}
        </h3>
        <p className="text-purple-700 font-semibold">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
};

export default SearchResultCard;
