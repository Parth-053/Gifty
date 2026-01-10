import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/common/Loader';

// =========================================================
// ⚡ LAZY LOADING PAGES (Performance Optimization)
// =========================================================

// Auth
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// Dashboard
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// Categories
const CategoriesList = lazy(() => import('../pages/categories/CategoriesList'));
const AddCategory = lazy(() => import('../pages/categories/AddCategory'));
const EditCategory = lazy(() => import('../pages/categories/EditCategory'));
const CategoryDetails = lazy(() => import('../pages/categories/CategoryDetails'));

// Products
const ProductsList = lazy(() => import('../pages/products/ProductsList'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const ProductApproval = lazy(() => import('../pages/products/ProductApproval'));

// Sellers
const SellersList = lazy(() => import('../pages/sellers/SellersList'));
const SellerDetails = lazy(() => import('../pages/sellers/SellerDetails'));
const SellerApproval = lazy(() => import('../pages/sellers/SellerApproval'));

// Users
const UsersList = lazy(() => import('../pages/users/UsersList'));
const UserDetails = lazy(() => import('../pages/users/UserDetails'));

// Orders
const OrdersList = lazy(() => import('../pages/orders/OrdersList'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));

// Payments
const Transactions = lazy(() => import('../pages/payments/Transactions'));
const Payouts = lazy(() => import('../pages/payments/Payouts'));

// Banners
const BannersList = lazy(() => import('../pages/banners/BannersList'));
const AddBanner = lazy(() => import('../pages/banners/AddBanner'));

// Analytics & Settings
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const GeneralSettings = lazy(() => import('../pages/settings/GeneralSettings'));
const RolesPermissions = lazy(() => import('../pages/settings/RolesPermissions'));
const AdminProfile = lazy(() => import('../pages/settings/AdminProfile'));

// 404
const NotFound = lazy(() => import('../pages/notfound/NotFound'));

// =========================================================
// ROUTER CONFIGURATION
// =========================================================

const AdminRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen text="Loading resources..." />}>
      <Routes>
        
        {/* --- PUBLIC ROUTES (No Sidebar) --- */}
        <Route path="/auth/login" element={<AdminLogin />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* --- PROTECTED ROUTES (With Admin Layout) --- */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Categories */}
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />

          {/* Products */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/approvals" element={<ProductApproval />} />

          {/* Sellers */}
          <Route path="/sellers" element={<SellersList />} />
          <Route path="/sellers/:id" element={<SellerDetails />} />
          <Route path="/sellers/approvals" element={<SellerApproval />} />

          {/* Users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />

          {/* Orders */}
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Payments */}
          <Route path="/payments" element={<Transactions />} />
          <Route path="/payments/payouts" element={<Payouts />} />

          {/* Banners */}
          <Route path="/banners" element={<BannersList />} />
          <Route path="/banners/add" element={<AddBanner />} />

          {/* Reports & Settings */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<GeneralSettings />} />
          <Route path="/settings/roles" element={<RolesPermissions />} />
          <Route path="/settings/profile" element={<AdminProfile />} />
        </Route>

        {/* --- FALLBACK --- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;