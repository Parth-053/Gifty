import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// Actions
import { syncSeller, logout, setLoading } from "./store/authSlice";
import store from "./store";

// Routes (Direct Imports)
import AuthRoutes from "./routes/AuthRoutes";
import SellerRoutes from "./routes/SellerRoutes";

// Components & Hooks
import Loader from "./components/common/Loader";
import useAuth from "./hooks/useAuth";

// --- Auth Orchestrator Component ---
// This component must be inside <Provider> and <Router> to use hooks
const AppContent = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, isApproved } = useAuth();

  useEffect(() => {
    // Global Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. User Logged In -> Sync Token & Profile
        const token = await currentUser.getIdToken();
        localStorage.setItem("token", token);
        
        // Fetch MongoDB Profile
        dispatch(syncSeller());
      } else {
        // 2. User Logged Out -> Cleanup
        localStorage.removeItem("token");
        dispatch(logout());
        dispatch(setLoading(false)); // Stop loading so Login page appears
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Global Loading Screen (Initial Auth Check)
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
      {/* THE BIG SWITCH:
        - If Approved Seller -> Show Dashboard Routes
        - Otherwise (Not logged in, Pending, Rejected) -> Show Auth Routes
        
        Note: We use "/*" because AuthRoutes and SellerRoutes have their own internal routing
      */}
      {isAuthenticated && isApproved ? (
        <Route path="/*" element={<SellerRoutes />} />
      ) : (
        <Route path="/*" element={<AuthRoutes />} />
      )}
    </Routes>
  );
};

// --- Main App Component ---
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