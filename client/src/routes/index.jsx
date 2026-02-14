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
import SearchResults from '../pages/Product/SearchResults';

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
          2. LAYOUT ROUTES (BottomBar IS Visible)
          (Navbar is conditionally hidden via AppLayout logic)
      ========================================================= */}
      <Route element={<AppLayout />}>
        
        {/* Protected Home */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* pages with BottomBar but NO Top Navbar (Handled in AppLayout) */}
        <Route path="/categories" element={<Categories />} /> 
        <Route path="/customize" element={<Customize />} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        
        {/* User Profile & Settings */}
        <Route path="/user/profile" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/user/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/user/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/user/coupons" element={<ProtectedRoute><MyCoupons /></ProtectedRoute>} />
        <Route path="/user/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/user/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/user/privacy" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Pages with standard Layout (Both Bars Visible) */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* =========================================================
          3. NO LAYOUT ROUTES (NO Navbar & NO BottomBar)
      ========================================================= */}
      
      {/* Search Flow */}
      <Route path="/search" element={<Search />} />
      <Route path="/search/results" element={<SearchResults />} />

      {/* Cart */}
      <Route path="/cart" element={<Cart />} />

      {/* Wishlist */}
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      } />

      {/* Address Management (Standalone) */}
      <Route path="/user/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
      <Route path="/user/addresses/add" element={<ProtectedRoute><ManageAddress /></ProtectedRoute>} />
      <Route path="/user/addresses/edit/:id" element={<ProtectedRoute><ManageAddress /></ProtectedRoute>} />

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

      {/* =========================================================
          4. FALLBACKS
      ========================================================= */}
      <Route path="/shop" element={<Navigate to="/categories" replace />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;