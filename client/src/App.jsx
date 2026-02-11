import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Components & Routes
import AppRoutes from './routes'; 
import { syncUser } from './store/authSlice'; // 👈 Updated Import
import { fetchCart } from './store/cartSlice';
import { fetchWishlist } from './store/wishlistSlice';

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

  // Global Initialization
  useEffect(() => {
    // 1. Check if user is logged in using the new syncUser thunk
    const initApp = async () => {
      const userAction = await dispatch(syncUser());  
       
      if (syncUser.fulfilled.match(userAction)) {  
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      }
    };

    initApp();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

export default App;