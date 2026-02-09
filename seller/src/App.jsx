import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// Actions & Store
import { syncSeller, logout, setLoading } from "./store/authSlice";
import store from "./store";

// Routes
import AuthRoutes from "./routes/AuthRoutes";
import SellerRoutes from "./routes/SellerRoutes";

// Components & Hooks
import Loader from "./components/common/Loader";
import useAuth from "./hooks/useAuth";

const AppContent = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, isApproved } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User logged in -> Sync Profile
        const token = await currentUser.getIdToken();
        localStorage.setItem("token", token);
        dispatch(syncSeller());
      } else {
        // User logged out -> Cleanup
        localStorage.removeItem("token");
        dispatch(logout());
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 text-sm animate-pulse">Loading Seller Portal...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Route Logic:
        - If Approved: Show Dashboard (SellerRoutes)
        - Otherwise: Show Auth Pages (Login/Register/Pending)
      */}
      {isAuthenticated && isApproved ? (
        <Route path="/*" element={<SellerRoutes />} />
      ) : (
        <Route path="/*" element={<AuthRoutes />} />
      )}
    </Routes>
  );
};

// Main App Component
// Note: We use Provider here because Main.jsx might be strict mode only
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;