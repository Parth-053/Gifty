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
import ManageAddress from '../pages/User/ManageAddress';
import OrderDetails from '../pages/User/OrderDetails';
import MyCoupons from '../pages/User/MyCoupons';
import Notifications from '../pages/User/Notifications';
import PaymentMethods from '../pages/User/PaymentMethods';
import Settings from '../pages/User/Settings';

// --- UTILITY PAGES ---
import About from '../pages/Utility/About';
import Contact from '../pages/Utility/Contact';
import Terms from '../pages/Utility/Terms';
import NotFound from '../pages/Utility/NotFound'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================================================
          1. PUBLIC AUTH ROUTES (No Navbar/BottomBar) 
      ========================================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} /> 

      {/* =========================================================
          2. LAYOUT ROUTES (Navbar & BottomBar ARE Visible)
      ========================================================= */}
      <Route element={<AppLayout />}>
        
        {/* Protected Home */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Public Browsing Pages */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        {/* Utility Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected User Routes (Account, Orders, Settings) */}
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/user/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        
        {/* Note: Address routes removed from here to hide navbar */}

        <Route path="/user/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/user/coupons" element={<ProtectedRoute><MyCoupons /></ProtectedRoute>} />
        <Route path="/user/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/user/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/user/privacy" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>

      {/* =========================================================
          3. NO LAYOUT ROUTES (Navbar/BottomBar REMOVED)
          (Cart, Wishlist, Checkout, AND NOW ADDRESSES)
      ========================================================= */}
      
      {/* Cart (Public based on your code) */}
      <Route path="/cart" element={<Cart />} />

      {/* Wishlist (Protected) */}
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      } />

      {/* Address Management (Moved here to hide Navbar/BottomBar) */}
      <Route path="/user/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
      <Route path="/user/addresses/add" element={<ProtectedRoute><ManageAddress /></ProtectedRoute>} />
      <Route path="/user/addresses/edit/:id" element={<ProtectedRoute><ManageAddress /></ProtectedRoute>} />

      {/* Checkout Flow (Protected) */}
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

      {/* =========================================================
          4. FALLBACKS
      ========================================================= */}
      <Route path="/shop" element={<Navigate to="/categories" replace />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;