import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-purple-700 text-white">
      <h1 className="text-xl font-bold">Gifty</h1>

      <div className="flex gap-4 text-xl">
        {/* Search */}
        <button onClick={() => navigate("/search")}>🔍</button>

        {/* Wishlist */}
        <button onClick={() => navigate("/wishlist")}>♡</button>
      </div>
    </header>
  );
};

export default Header;
