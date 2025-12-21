import { useNavigate } from "react-router-dom";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 mt-4">
      <h1 className="text-lg font-semibold">{product.title}</h1>

      <div className="mt-2 text-xl font-bold text-purple-700">
        ₹{product.price}
      </div>

      {product.isCustomizable && (
        <button
          onClick={() => navigate(`/customize/${product._id}`)}
          className="mt-4 w-full bg-purple-700 text-white py-3 rounded-xl font-semibold"
        >
          Customize This Gift 🎨
        </button>
      )}
    </div>
  );
};

export default ProductInfo;
