import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice';
import categoryReducer from './categorySlice';
import bannerReducer from './bannerSlice';
import orderReducer from './orderSlice';
import uiReducer from './uiSlice'; // Ensure you have this or remove if not using sidebar

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    orders: orderReducer,
    ui: uiReducer, 
  },
  // Disable serializable check if you plan to store non-serializable data (optional, generally not recommended but helpful for file uploads sometimes)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;