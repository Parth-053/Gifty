import { useNavigate } from "react-router-dom";

const ProductDetailHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <button onClick={() => navigate(-1)} className="text-xl">
        ←
      </button>

      <button
        onClick={() => navigate("/wishlist")}
        className="text-xl"
      >
        ♡
      </button>
    </header>
  );
};

export default ProductDetailHeader;
