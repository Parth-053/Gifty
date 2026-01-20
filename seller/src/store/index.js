// File: seller/src/store/index.js (Updated)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';
import financeReducer from './financeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    analytics: analyticsReducer,
    finance: financeReducer,
  },
});

export default store;