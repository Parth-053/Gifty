// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './config/firebase'; 

// Components & Routes
import AppRoutes from './routes'; 
import { syncUser, logoutUser } from './store/authSlice'; 
import { fetchCart } from './store/cartSlice';
import { fetchWishlist } from './store/wishlistSlice';
import Loader from './components/common/Loader'; 

// Helper Component: Scroll To Top
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Block rendering until auth is checked

  useEffect(() => {
    // LISTENER: Waits for Firebase to restore the session from localStorage
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // User session found! Now sync with MongoDB
          await dispatch(syncUser()).unwrap();
          
          // Fetch data immediately after sync
          dispatch(fetchCart());
          dispatch(fetchWishlist());
        } catch (error) {
          console.error("Auto-login sync failed:", error);
        }
      } else {
        // No session found
        dispatch(logoutUser());
      }
      
      // Stop loading once we know the status (LoggedIn or LoggedOut)
      setIsAuthChecking(false); 
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Show a full-screen loader while checking session
  if (isAuthChecking) {
     return <Loader fullScreen text="Starting Gifty..." />;
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

export default App;