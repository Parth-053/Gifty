import { NavLink, useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const itemClass = ({ isActive }) =>
    `flex flex-col items-center text-xs ${
      isActive ? "text-yellow-300" : "text-white"
    }`;

  const handleProtectedNav = (path) => {
    if (!token) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-purple-700 flex justify-around py-2 z-50">
      <NavLink to="/" className={itemClass}>🏠 Home</NavLink>
      <NavLink to="/customize" className={itemClass}>🎨 Customize</NavLink>
      <NavLink to="/categories" className={itemClass}>📂 Categories</NavLink>

      <button
        onClick={() => handleProtectedNav("/cart")}
        className="flex flex-col items-center text-xs text-white"
      >
        🛒 Cart
      </button>

      <button
        onClick={() => handleProtectedNav("/account")}
        className="flex flex-col items-center text-xs text-white"
      >
        👤 Account
      </button>
    </nav>
  );
};

export default BottomNavbar;
