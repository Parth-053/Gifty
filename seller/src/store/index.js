import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import financeReducer from "./financeSlice";
import dashboardReducer from "./dashboardSlice";
import analyticsReducer from "./analyticsSlice";
import categoryReducer from "./categorySlice";
import sellerReducer from "./sellerSlice";
import notificationReducer from "./notificationSlice";  

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    finance: financeReducer,
    dashboard: dashboardReducer,
    analytics: analyticsReducer,
    categories: categoryReducer,
    seller: sellerReducer,
    notifications: notificationReducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,  
    }),
});

export default store;