import { Routes, Route } from "react-router-dom";

/* Core Pages */
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

/* Search & Wishlist */
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";

/* Account & Profile */
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";
import Addresses from "./pages/Addresses";

/* Orders */
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

/* Info Pages */
import Help from "./pages/Help";
import About from "./pages/About";
import Notifications from "./pages/Notifications";

/* Auth Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <Routes>
      {/* Home & Discovery */}
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/customize" element={<Customize />} />

      {/* Search */}
      <Route path="/search" element={<Search />} />
      <Route path="/search/results" element={<SearchResults />} />

      {/* Cart & Checkout */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Wishlist */}
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Account */}
      <Route path="/account" element={<Account />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/addresses" element={<Addresses />} />

      {/* Orders */}
      <Route path="/orders" element={<Orders />} />
      <Route path="/order/:id" element={<OrderDetail />} />

      {/* Support & Info */}
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<About />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Login & Signup */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

    </Routes>
  );
}

export default App;
