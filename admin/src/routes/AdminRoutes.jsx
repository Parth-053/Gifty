import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";

//  Lazy Load Pages
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Analytics = lazy(() => import("../pages/analytics/Analytics"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Modules
const UsersList = lazy(() => import("../pages/users/UsersList"));
const UserDetails = lazy(() => import("../pages/users/UserDetails"));

const SellersList = lazy(() => import("../pages/sellers/SellersList"));
const SellerDetails = lazy(() => import("../pages/sellers/SellerDetails"));
const SellerApproval = lazy(() => import("../pages/sellers/SellerApproval"));

const ProductsList = lazy(() => import("../pages/products/ProductsList"));
const ProductDetails = lazy(() => import("../pages/products/ProductDetails"));
const ProductApproval = lazy(() => import("../pages/products/ProductApproval"));

const CategoriesList = lazy(() => import("../pages/categories/CategoriesList"));
const AddCategory = lazy(() => import("../pages/categories/AddCategory"));
const EditCategory = lazy(() => import("../pages/categories/EditCategory"));
const CategoryDetails = lazy(() => import("../pages/categories/CategoryDetails"));

const OrdersList = lazy(() => import("../pages/orders/OrdersList"));
const OrderDetails = lazy(() => import("../pages/orders/OrderDetails"));

const Transactions = lazy(() => import("../pages/finance/Transactions"));
const Payouts = lazy(() => import("../pages/finance/Payouts"));

const BannersList = lazy(() => import("../pages/banners/BannersList"));
const AddBanner = lazy(() => import("../pages/banners/AddBanner"));

// Settings (Only Profile kept)
const AdminProfile = lazy(() => import("../pages/settings/AdminProfile"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen={true} />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />

          {/* Core Features */}
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetails />} />

          <Route path="sellers" element={<SellersList />} />
          <Route path="sellers/:id" element={<SellerDetails />} />
          <Route path="approvals/sellers" element={<SellerApproval />} />

          <Route path="products" element={<ProductsList />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="approvals/products" element={<ProductApproval />} />

          <Route path="categories" element={<CategoriesList />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="categories/:id" element={<CategoryDetails />} />

          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetails />} />

          <Route path="finance/transactions" element={<Transactions />} />
          <Route path="finance/payouts" element={<Payouts />} />

          <Route path="banners" element={<BannersList />} />
          <Route path="banners/add" element={<AddBanner />} />

          {/* Settings (Simplified) */}
          <Route path="settings" element={<Navigate to="/settings/profile" replace />} />
          <Route path="settings/profile" element={<AdminProfile />} />
          
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;