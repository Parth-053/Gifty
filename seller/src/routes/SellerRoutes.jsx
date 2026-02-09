import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';
import Loader from '../components/common/Loader';

// Lazy Load Pages for Performance
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProductList = lazy(() => import('../pages/products/ProductList'));
const AddProduct = lazy(() => import('../pages/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const OrderList = lazy(() => import('../pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const PayoutHistory = lazy(() => import('../pages/finance/PayoutHistory'));
const Transactions = lazy(() => import('../pages/finance/Transactions'));
const Notifications = lazy(() => import('../pages/notifications/Notifications'));
const HelpCenter = lazy(() => import('../pages/support/HelpCenter'));
const ContactSupport = lazy(() => import('../pages/support/ContactSupport'));

// Profile Pages
const StoreSettings = lazy(() => import('../pages/profile/StoreSettings'));
const SellerProfile = lazy(() => import('../pages/profile/SellerProfile'));
const BankDetails = lazy(() => import('../pages/profile/BankDetails'));

// Helper Wrapper for Lazy Loading
const SuspenseLoader = ({ children }) => (
  <Suspense fallback={<div className="flex justify-center items-center h-[80vh]"><Loader size="lg"/></div>}>
    {children}
  </Suspense>
);

const SellerRoutes = () => {
  return (
    <SellerLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<SuspenseLoader><Dashboard /></SuspenseLoader>} />
        
        {/* Products */}
        <Route path="/products" element={<SuspenseLoader><ProductList /></SuspenseLoader>} />
        <Route path="/products/add" element={<SuspenseLoader><AddProduct /></SuspenseLoader>} />
        <Route path="/products/edit/:id" element={<SuspenseLoader><EditProduct /></SuspenseLoader>} />
        <Route path="/products/:id" element={<SuspenseLoader><ProductDetails /></SuspenseLoader>} />
        
        {/* Orders */}
        <Route path="/orders" element={<SuspenseLoader><OrderList /></SuspenseLoader>} />
        <Route path="/orders/:id" element={<SuspenseLoader><OrderDetails /></SuspenseLoader>} />
        
        {/* Analytics */}
        <Route path="/analytics" element={<SuspenseLoader><Analytics /></SuspenseLoader>} />
        
        {/* Finance */}
        <Route path="/finance" element={<Navigate to="/finance/transactions" replace />} />
        <Route path="/finance/transactions" element={<SuspenseLoader><Transactions /></SuspenseLoader>} />
        <Route path="/finance/payouts" element={<SuspenseLoader><PayoutHistory /></SuspenseLoader>} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<Navigate to="/profile/store-settings" replace />} />
        <Route path="/profile/store-settings" element={<SuspenseLoader><StoreSettings /></SuspenseLoader>} />
        <Route path="/profile/personal" element={<SuspenseLoader><SellerProfile /></SuspenseLoader>} />
        <Route path="/profile/bank-details" element={<SuspenseLoader><BankDetails /></SuspenseLoader>} />
        
        {/* Support & Notifications */}
        <Route path="/notifications" element={<SuspenseLoader><Notifications /></SuspenseLoader>} />
        <Route path="/support" element={<SuspenseLoader><HelpCenter /></SuspenseLoader>} />
        <Route path="/support/contact" element={<SuspenseLoader><ContactSupport /></SuspenseLoader>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </SellerLayout>
  );
};

export default SellerRoutes;