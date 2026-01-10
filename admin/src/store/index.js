import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import sellerReducer from './sellerSlice';
import dashboardReducer from './dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    sellers: sellerReducer,
    dashboard: dashboardReducer,
  },
});

export default store;