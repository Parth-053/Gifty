import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";

import ProductsList from "./pages/products/ProductsList";
import ProductDetails from "./pages/products/ProductDetails";
import ProductApproval from "./pages/products/ProductApproval";

import CategoriesList from "./pages/categories/CategoriesList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

import OrdersList from "./pages/orders/OrdersList";
import OrderDetails from "./pages/orders/OrderDetails";

import SellersList from "./pages/sellers/SellersList";
import SellerDetails from "./pages/sellers/SellerDetails";
import SellerApproval from "./pages/sellers/SellerApproval";

import UsersList from "./pages/users/UsersList";
import UserDetails from "./pages/users/UserDetails";

import Transactions from "./pages/finance/Transactions";
import Payouts from "./pages/finance/Payouts";

import BannersList from "./pages/banners/BannersList";
import AddBanner from "./pages/banners/AddBanner";

import CouponsList from "./pages/coupons/CouponsList"; // New
import AddCoupon from "./pages/coupons/AddCoupon"; // New

import Settings from "./pages/settings/Settings"; // New
import ReturnRequests from "./pages/returns/ReturnRequests"; // New

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />

              {/* Products */}
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/approvals" element={<ProductApproval />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              {/* Categories */}
              <Route path="/categories" element={<CategoriesList />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />

              {/* Orders */}
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              
              {/* Returns */}
              <Route path="/returns" element={<ReturnRequests />} />

              {/* Sellers */}
              <Route path="/sellers" element={<SellersList />} />
              <Route path="/sellers/approvals" element={<SellerApproval />} />
              <Route path="/sellers/:id" element={<SellerDetails />} />

              {/* Users */}
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:id" element={<UserDetails />} />

              {/* Finance */}
              <Route path="/finance/transactions" element={<Transactions />} />
              <Route path="/finance/payouts" element={<Payouts />} />

              {/* Marketing */}
              <Route path="/banners" element={<BannersList />} />
              <Route path="/banners/add" element={<AddBanner />} />
              <Route path="/coupons" element={<CouponsList />} />
              <Route path="/coupons/add" element={<AddCoupon />} />

              {/* System */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;