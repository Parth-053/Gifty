import React from 'react';
import { Navigate } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// --- CHANGE: Use Direct Imports instead of lazy() ---
import Dashboard from '../pages/dashboard/Dashboard';
import ProductList from '../pages/products/ProductList';
import AddProduct from '../pages/products/AddProduct';
import EditProduct from '../pages/products/EditProduct';
import ProductDetails from '../pages/products/ProductDetails';
import OrderList from '../pages/orders/OrderList';
import OrderDetails from '../pages/orders/OrderDetails';
import Analytics from '../pages/analytics/Analytics';
import SellerProfile from '../pages/profile/SellerProfile';
import StoreSettings from '../pages/profile/StoreSettings';
import BankDetails from '../pages/profile/BankDetails';
import PayoutHistory from '../pages/finance/PayoutHistory';
import HelpCenter from '../pages/support/HelpCenter';

const SellerRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <SellerLayout />
    </ProtectedRoute>
  ),
  children: [
    // Redirect root '/' to '/dashboard'
    { index: true, element: <Navigate to="dashboard" replace /> },
    
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