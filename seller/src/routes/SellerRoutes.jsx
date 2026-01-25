import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';
import Loader from '../components/common/Loader';

// Lazy Load Pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProductList = lazy(() => import('../pages/products/ProductList'));
const AddProduct = lazy(() => import('../pages/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const OrderList = lazy(() => import('../pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const StoreSettings = lazy(() => import('../pages/profile/StoreSettings'));
const PayoutHistory = lazy(() => import('../pages/finance/PayoutHistory'));
const Transactions = lazy(() => import('../pages/finance/Transactions'));
const Notifications = lazy(() => import('../pages/notifications/Notifications'));
const HelpCenter = lazy(() => import('../pages/support/HelpCenter'));

// Loading Wrapper (Fixes ESLint 'unused var' issue)
const SuspenseLoader = ({ children }) => (
  <Suspense fallback={<div className="flex justify-center p-10"><Loader /></div>}>
    {children}
  </Suspense>
);

const SellerRoutes = {
  path: '/',
  element: <SellerLayout />, 
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    
    // Dashboard
    { path: 'dashboard', element: <SuspenseLoader><Dashboard /></SuspenseLoader> },
    
    // Inventory
    { path: 'products', element: <SuspenseLoader><ProductList /></SuspenseLoader> },
    { path: 'products/add', element: <SuspenseLoader><AddProduct /></SuspenseLoader> },
    { path: 'products/edit/:id', element: <SuspenseLoader><EditProduct /></SuspenseLoader> },
    { path: 'products/:id', element: <SuspenseLoader><ProductDetails /></SuspenseLoader> },
    
    // Orders
    { path: 'orders', element: <SuspenseLoader><OrderList /></SuspenseLoader> },
    { path: 'orders/:id', element: <SuspenseLoader><OrderDetails /></SuspenseLoader> },
    
    // Analytics
    { path: 'analytics', element: <SuspenseLoader><Analytics /></SuspenseLoader> },
    
    // Finance
    { path: 'finance/transactions', element: <SuspenseLoader><Transactions /></SuspenseLoader> },
    { path: 'finance/payouts', element: <SuspenseLoader><PayoutHistory /></SuspenseLoader> },
    
    // Settings (Unified)
    { path: 'profile/store-settings', element: <SuspenseLoader><StoreSettings /></SuspenseLoader> },
    
    // Support & Notifications
    { path: 'notifications', element: <SuspenseLoader><Notifications /></SuspenseLoader> },
    { path: 'support', element: <SuspenseLoader><HelpCenter /></SuspenseLoader> },
  ]
};

export default SellerRoutes;