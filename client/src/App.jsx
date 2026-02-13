import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut directly
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
  const [isAuthChecking, setIsAuthChecking] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Attempt to sync Firebase user with MongoDB
          await dispatch(syncUser()).unwrap();
          
          // Only fetch data if sync succeeds
          dispatch(fetchCart());
          dispatch(fetchWishlist());
        } catch (error) {
          console.warn("Auto-login sync failed:", error);
          
          // CRITICAL FIX: If Sync fails (User deleted in DB but exists in Firebase),
          // DO NOT dispatch logoutUser() which calls the API. 
          // Just manually kill the session locally.
          await signOut(auth);
          localStorage.removeItem('token');
          // Update Redux state to reflect logout
          dispatch(logoutUser.fulfilled()); 
        }
      } else {
        // No session found, ensure Redux state is clear
        // We dispatch the fulfilled action directly to clear state without API call
        dispatch(logoutUser.fulfilled());
      }
      
      setIsAuthChecking(false); 
    });

    return () => unsubscribe();
  }, [dispatch]);

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