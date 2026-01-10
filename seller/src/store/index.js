import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    analytics: analyticsReducer,
  },
});

export default store;