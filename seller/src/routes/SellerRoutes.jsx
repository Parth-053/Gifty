import React, { lazy } from 'react';
import SellerLayout from '../components/layout/SellerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Lazy loading pages for better performance
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProductList = lazy(() => import('../pages/products/ProductList'));
const AddProduct = lazy(() => import('../pages/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const OrderList = lazy(() => import('../pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const SellerProfile = lazy(() => import('../pages/profile/SellerProfile'));
const StoreSettings = lazy(() => import('../pages/profile/StoreSettings'));
const BankDetails = lazy(() => import('../pages/profile/BankDetails'));
const PayoutHistory = lazy(() => import('../pages/finance/PayoutHistory'));
const HelpCenter = lazy(() => import('../pages/support/HelpCenter'));

const SellerRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <SellerLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'products', element: <ProductList /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },
    { path: 'products/:id', element: <ProductDetails /> },
    { path: 'orders', element: <OrderList /> },
    { path: 'orders/:id', element: <OrderDetails /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'profile/me', element: <SellerProfile /> },
    { path: 'profile/settings', element: <StoreSettings /> },
    { path: 'profile/bank', element: <BankDetails /> },
    { path: 'finance/payouts', element: <PayoutHistory /> },
    { path: 'support', element: <HelpCenter /> },
  ]
};

export default SellerRoutes;