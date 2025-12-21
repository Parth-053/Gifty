import { useNavigate } from "react-router-dom";

const CategoriesHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-purple-700 text-white flex items-center justify-between px-4 z-50">
      <h1 className="font-semibold text-lg">All Categories</h1>

      <div className="flex gap-4 text-xl">
        {/* Search */}
        <button onClick={() => navigate("/search")}>🔍</button>

        {/* Wishlist */}
        <button onClick={() => navigate("/wishlist")}>♡</button>
      </div>
    </header>
  );
};

export default CategoriesHeader;
