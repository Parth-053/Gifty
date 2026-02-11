import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// --- Auth PAGES ---
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyEmail from '../pages/Auth/VerifyEmail'; 

// --- MAIN PAGES ---
import Home from '../pages/Main/Home';
import Categories from '../pages/Main/Categories';
import Customize from '../pages/Main/Customize';
import Wishlist from '../pages/Main/Wishlist';
import Account from '../pages/Main/Account';
import MyOrders from '../pages/Main/MyOrders';

// --- PRODUCT PAGES ---
import ProductDetails from '../pages/Product/ProductDetails';
import Search from '../pages/Product/Search';

// --- CHECKOUT PAGES ---
import Cart from '../pages/Checkout/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/Checkout/OrderSuccess';

// --- USER DASHBOARD PAGES ---
import EditProfile from '../pages/User/EditProfile';
import SavedAddresses from '../pages/User/SavedAddresses';
import OrderDetails from '../pages/User/OrderDetails';
import MyCoupons from '../pages/User/MyCoupons';
import Notifications from '../pages/User/Notifications';
import PaymentMethods from '../pages/User/PaymentMethods';
import Settings from '../pages/User/Settings';

// --- UTILITY PAGES ---
import About from '../pages/Utility/About';
import Contact from '../pages/Utility/Contact';

// --- ERROR PAGE ---
import NotFound from '../pages/Utility/NotFound'; // Ensure correct path

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Routes (No Layout or Different Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} /> 

      {/* 2. App Layout Routes (Navbar, Footer, etc.) */}
      <Route element={<AppLayout />}>
        
        {/* === HOME PAGE (Now Protected) === */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Public Browsing Pages inside Layout (Optional: Wrap these in ProtectedRoute too if you want the ENTIRE app locked down) */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Utility Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />

        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="/user/profile" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />

        {/* User Dashboard Sub-pages */}
        <Route path="/user/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/user/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
        <Route path="/user/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/user/coupons" element={<ProtectedRoute><MyCoupons /></ProtectedRoute>} />
        <Route path="/user/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/user/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/user/privacy" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Checkout Flow */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout/success" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />

        {/* === REDIRECTS & 404 === */}
        <Route path="/shop" element={<Navigate to="/categories" replace />} />
        <Route path="*" element={<NotFound />} />
      
      </Route>
    </Routes>
  );
};

export default AppRoutes;