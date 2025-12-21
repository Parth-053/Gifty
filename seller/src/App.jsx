import { Routes, Route, Navigate } from "react-router-dom";
import useAuth  from "./context/useAuth";

import ProtectedSellerRoute from "./pages/ProtectedSeller";
import SellerLayout from "./layout/SellerLayout";

import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import VerifyOtp from "./pages/VerifyOtp";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import SellerProfile from "./pages/SellerProfile";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<SellerLogin />} />
      <Route path="/register" element={<SellerRegister />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* PROTECTED SELLER */}
      <Route
        element={
          <ProtectedSellerRoute>
            <SellerLayout />
          </ProtectedSellerRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<AddProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<SellerProfile />} />
      </Route>

      {/* DEFAULT */}
      <Route
        path="/"
        element={
          user && user.role === "seller" ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;
