import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// --- AUTH PAGES ---
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';

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
import Terms from '../pages/Utility/Terms';
import NotFound from '../pages/Utility/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* AppLayout wraps pages with Navbar and Footer */}
      <Route element={<AppLayout />}>
        
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        {/* Cart can be public, but checkout requires login */}
        <Route path="/cart" element={<Cart />} />

        {/* Utility Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* === PROTECTED ROUTES (Login Required) === */}
        
        {/* Main User Features */}
        <Route path="/customize" element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        } />
        
        <Route path="/user/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />

        <Route path="/user/orders" element={
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