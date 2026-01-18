import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Providers (Global State)
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// 2. Layout (Bottom Navbar)
import AppLayout from './components/layout/AppLayout';

// 3. Pages - Main Tabs (Bottom Nav wale pages)
import Home from './pages/Main/Home';
import Categories from './pages/Main/Categories.jsx';
import Customize from './pages/Main/Customize';
import MyOrders from './pages/Main/MyOrders';
import Account from './pages/Main/Account';

// 4. Pages - Full Screen (Product & Search)
import Search from './pages/Product/Search';
import ProductDetails from './pages/Product/ProductDetails';
import Wishlist from './pages/Main/Wishlist'; 

// 5. Pages - Checkout Flow
import Cart from './pages/Checkout/Cart';
import CheckoutAddress from './pages/Checkout/CheckoutAddress';
import Payment from './pages/Checkout/Payment';
import OrderSuccess from './pages/Checkout/OrderSuccess';

// 6. Pages - User Sub-pages
import EditProfile from './pages/User/EditProfile';
import OrderDetails from './pages/User/OrderDetails';
import SavedAddresses from './pages/User/SavedAddresses';
import PaymentMethods from './pages/User/PaymentMethods';
import Notifications from './pages/User/Notifications';
import Settings from './pages/User/Settings';
import Privacy from './pages/User/Privacy';
import MyCoupons from './pages/User/MyCoupons';

// 7. Pages - Legal
import Help from './pages/Legal/Help';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          
          <Routes>
            {/* ✅ GROUP 1: Pages with Bottom Navbar */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/orders" element={<MyOrders />} /> {/* Tab Link */}
              <Route path="/account" element={<Account />} />
            </Route>

            {/* ✅ GROUP 2: Full Screen Pages (No Bottom Navbar) */}
            
            {/* Product Discovery */}
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:productId" element={<ProductDetails />} />

            {/* Checkout System */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/payment" element={<Payment />} />
            <Route path="/checkout/success" element={<OrderSuccess />} />

            {/* Account Details */}
            <Route path="/account/edit-profile" element={<EditProfile />} />
            <Route path="/account/orders/:orderId" element={<OrderDetails />} /> {/* Deep Link */}
            <Route path="/account/addresses" element={<SavedAddresses />} />
            <Route path="/account/payments" element={<PaymentMethods />} />
            <Route path="/account/notifications" element={<Notifications />} />
            <Route path="/account/coupons" element={<MyCoupons />} />
            
            {/* Settings & Help */}
            <Route path="/account/settings" element={<Settings />} />
            <Route path="/account/privacy" element={<Privacy />} />
            <Route path="/account/help" element={<Help />} />

          </Routes>

        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;