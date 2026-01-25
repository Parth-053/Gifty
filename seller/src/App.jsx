import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { syncSellerProfile, logoutSeller, setLoading } from "./store/authSlice";
import router from "./routes"; // Import the router configuration
import Loader from "./components/common/Loader";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is logged in to Firebase, sync with Backend
        dispatch(syncSellerProfile());
      } else {
        // User logged out
        dispatch(logoutSeller());
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Use the RouterProvider with the router config from routes/index.jsx
  return <RouterProvider router={router} />;
};

export default App;