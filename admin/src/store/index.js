import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import sellerReducer from "./sellerSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import categoryReducer from "./categorySlice";
import bannerReducer from "./bannerSlice";
import financeReducer from "./financeSlice";
import dashboardReducer from "./dashboardSlice";
import couponReducer from "./couponSlice";           
import settingsReducer from "./settingsSlice";   
import returnReducer from "./returnSlice";    

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    sellers: sellerReducer,
    products: productReducer,
    orders: orderReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    finance: financeReducer,
    dashboard: dashboardReducer,
    coupons: couponReducer,
    settings: settingsReducer,
    returns: returnReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Helps with complex data/Date objects
    }),
});

export default store;