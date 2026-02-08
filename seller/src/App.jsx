import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { Toaster } from "react-hot-toast";

// --- FIXED IMPORTS: Used updated names 'syncSeller' and 'logout' ---
import { syncSeller, logout, setLoading } from "./store/authSlice"; 
import router from "./routes"; 
import Loader from "./components/common/Loader";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Global Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is logged in to Firebase -> Fetch MongoDB Profile
        // --- FIX: Updated action name ---
        dispatch(syncSeller());
      } else {
        // User is logged out -> Clear Redux State
        // --- FIX: Updated action name ---
        dispatch(logout());
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;