import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { loginSuccess, logout, setLoading } from "./store/authSlice";
import store from "./store";

// Components
import Loader from "./components/common/Loader";  

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";

import ProductsList from "./pages/products/ProductsList";
import ProductDetails from "./pages/products/ProductDetails";
import ProductApproval from "./pages/products/ProductApproval";
import EditProduct from "./pages/products/EditProduct";

import CategoriesList from "./pages/categories/CategoriesList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

import OrdersList from "./pages/orders/OrdersList";
import OrderDetails from "./pages/orders/OrderDetails";

import SellersList from "./pages/sellers/SellersList";
import SellerDetails from "./pages/sellers/SellerDetails";
import SellerApproval from "./pages/sellers/SellerApproval";

import UsersList from "./pages/users/UsersList";
import UserDetails from "./pages/users/UserDetails";

import Transactions from "./pages/finance/Transactions";
import Payouts from "./pages/finance/Payouts";

import BannersList from "./pages/banners/BannersList";
import AddBanner from "./pages/banners/AddBanner";
import EditBanner from "./pages/banners/EditBanner";

import CouponsList from "./pages/coupons/CouponsList"; 
import AddCoupon from "./pages/coupons/AddCoupon"; 
import EditCoupon from "./pages/coupons/EditCoupon";

import Settings from "./pages/settings/Settings"; 
import ReturnRequests from "./pages/returns/ReturnRequests"; 

import Notifications from "./pages/notifications/Notifications";

// 1. Inner Component for Logic (Auth + Routing)
const AppRoutes = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Firebase Listener: Checks if user is logged in even after refresh
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User found in Firebase session
        const token = await currentUser.getIdToken();
        
        dispatch(loginSuccess({
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          token: token
        }));
      } else {
        // No user found
        dispatch(logout());
      }
      // Stop loader once check is done
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Show Loader while checking session
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Products */}
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/approvals" element={<ProductApproval />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />

            {/* Categories */}
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            
            {/* Returns */}
            <Route path="/returns" element={<ReturnRequests />} />

            {/* Sellers */}
            <Route path="/sellers" element={<SellersList />} />
            <Route path="/sellers/approvals" element={<SellerApproval />} />
            <Route path="/sellers/:id" element={<SellerDetails />} />

            {/* Users */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />

            {/* Finance */}
            <Route path="/finance/transactions" element={<Transactions />} />
            <Route path="/finance/payouts" element={<Payouts />} />

            {/* Marketing */}
            <Route path="/banners" element={<BannersList />} />
            <Route path="/banners/add" element={<AddBanner />} />
            <Route path="/banners/edit/:id" element={<EditBanner />} />
            <Route path="/coupons" element={<CouponsList />} />
            <Route path="/coupons/add" element={<AddCoupon />} />
            <Route path="/coupons/edit/:id" element={<EditCoupon />} />

            {/* System */}
            <Route path="/settings" element={<Settings />} />

            {/* Notifications */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

// 2. Main App Component (Wraps Provider)
const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;