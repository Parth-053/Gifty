// src/layouts/SellerLayout.jsx
import SellerNavbar from "../components/SellerNavbar";
import { Outlet } from "react-router-dom";

const SellerLayout = () => {
  return (
    <div>
      <SellerNavbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
