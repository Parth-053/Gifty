import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { syncSellerProfile, logoutSeller, setLoading } from "./store/authSlice";

// Layouts
import SellerLayout from "./components/layout/SellerLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PendingApproval from "./pages/auth/PendingApproval";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";

// Product Pages
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ProductDetails from "./pages/products/ProductDetails";

// Order Pages
import OrderList from "./pages/orders/OrderList";
import OrderDetails from "./pages/orders/OrderDetails";

// Finance Pages
import Transactions from "./pages/finance/Transactions";
import Payouts from "./pages/finance/PayoutHistory";

// Profile Pages
import SellerProfile from "./pages/profile/SellerProfile";
import StoreSettings from "./pages/profile/StoreSettings";
import BankDetails from "./pages/profile/BankDetails";

// Support & Legal
import HelpCenter from "./pages/support/HelpCenter";
import ContactSupport from "./pages/support/ContactSupport";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";

// Notifications Page (Added)
import Notifications from "./pages/notifications/Notifications";

// Common
import Loader from "./components/common/Loader";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Initialize Firebase Auth Listener
  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in to Firebase, sync with MongoDB
        // The token is handled automatically by axios interceptor if auth.currentUser is set
        await dispatch(syncSellerProfile());
      } else {
        // User is signed out
        dispatch(logoutSeller());
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/pending" element={<PendingApproval />} />
        
        {/* Legal Pages (Public) */}
        <Route path="/legal/terms" element={<TermsAndConditions />} />
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />

        {/* --- Protected Seller Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SellerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Inventory */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Orders */}
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />

            {/* Finance */}
            <Route path="/finance/transactions" element={<Transactions />} />
            <Route path="/finance/payouts" element={<Payouts />} />

            {/* Profile & Settings */}
            <Route path="/profile" element={<SellerProfile />} />
            <Route path="/settings/store" element={<StoreSettings />} />
            <Route path="/settings/bank" element={<BankDetails />} />

            {/* Support */}
            <Route path="/support" element={<HelpCenter />} />
            <Route path="/support/contact" element={<ContactSupport />} />

            {/* Notifications (Added) */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* Catch All - 404 */}
        <Route path="*" element={<div className="h-screen flex items-center justify-center text-xl text-gray-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;