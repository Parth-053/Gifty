import { useNavigate } from "react-router-dom";

const WishlistHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
      <button
        onClick={() => navigate(-1)}
        className="text-xl"
      >
        ←
      </button>

      <h1 className="text-lg font-semibold">My Wishlist</h1>
    </header>
  );
};

export default WishlistHeader;
