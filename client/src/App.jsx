import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Components & Routes
import AppRoutes from './routes'; // The file we created with all the Paths
import { checkAuthStatus } from './store/authSlice';
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
    // 1. Check if user is logged in
    const initApp = async () => {
      const userAction = await dispatch(checkAuthStatus());
      
      // 2. If logged in, fetch their cart and wishlist immediately
      if (checkAuthStatus.fulfilled.match(userAction)) {
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