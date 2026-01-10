import { lazy } from 'react';

// 1. AUTH PAGES (Public)
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// 2. DASHBOARD (Private)
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// 3. PRODUCTS (Private)
const ProductList = lazy(() => import('../pages/products/ProductList'));
const AddProduct = lazy(() => import('../pages/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));

// 4. ORDERS (Private)
const OrderList = lazy(() => import('../pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));

// 5. ANALYTICS & PROFILE (Private)
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const SellerProfile = lazy(() => import('../pages/profile/SellerProfile'));
const StoreSettings = lazy(() => import('../pages/profile/StoreSettings'));
const HelpCenter = lazy(() => import('../pages/support/HelpCenter'));

// =================================================================
// ROUTE CONFIGURATION ARRAY
// =================================================================

export const routes = [
  // --- AUTH ROUTES (No Sidebar) ---
  {
    path: '/auth/login',
    component: Login,
    layout: 'auth', // Blank layout
    isPrivate: false,
  },
  {
    path: '/auth/register',
    component: Register,
    layout: 'auth',
    isPrivate: false,
  },
  {
    path: '/auth/forgot-password',
    component: ForgotPassword,
    layout: 'auth',
    isPrivate: false,
  },

  // --- DASHBOARD ---
  {
    path: '/dashboard',
    component: Dashboard,
    layout: 'seller', // Sidebar + Navbar
    isPrivate: true,
  },
  {
    path: '/', // Redirect root to dashboard
    component: Dashboard, 
    layout: 'seller',
    isPrivate: true,
    exact: true,
  },

  // --- PRODUCTS ---
  {
    path: '/products',
    component: ProductList,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/products/add',
    component: AddProduct,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/products/edit/:id',
    component: EditProduct,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/products/:id',
    component: ProductDetails,
    layout: 'seller',
    isPrivate: true,
  },

  // --- ORDERS ---
  {
    path: '/orders',
    component: OrderList,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/orders/:id',
    component: OrderDetails,
    layout: 'seller',
    isPrivate: true,
  },

  // --- ANALYTICS & SETTINGS ---
  {
    path: '/analytics',
    component: Analytics,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/profile/me',
    component: SellerProfile,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/profile/settings',
    component: StoreSettings,
    layout: 'seller',
    isPrivate: true,
  },
  {
    path: '/support',
    component: HelpCenter,
    layout: 'seller',
    isPrivate: true,
  },
];