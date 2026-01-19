import { configureStore } from "@reduxjs/toolkit";

// Import all slices
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import sellerReducer from "./sellerSlice"; 
import productReducer from "./productSlice"; 
import categoryReducer from "./categorySlice"; 
import orderReducer from "./orderSlice";     
import financeReducer from "./financeSlice";   
import dashboardReducer from "./dashboardSlice"; 
import bannerReducer from "./bannerSlice";     

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    sellers: sellerReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    finance: financeReducer,
    dashboard: dashboardReducer,
    banners: bannerReducer,
  },
  // Disable serializableCheck for complex data types (like Dates/Files) if needed, 
  // though usually Redux Toolkit handles it well.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;