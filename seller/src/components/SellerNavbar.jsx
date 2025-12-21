// src/components/SellerNavbar.jsx
import { NavLink } from "react-router-dom";

const SellerNavbar = () => {
  return (
    <div className="bg-purple-700 text-white px-6 py-4 flex gap-6">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/analytics">Analytics</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </div>
  );
};

export default SellerNavbar;
