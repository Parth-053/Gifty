import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import SellerRoutes from './SellerRoutes';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([ 
  // 1. Public Auth Routes (Login, Register, Forgot Password)
  AuthRoutes,

  // 2. Protected Routes (Require Login & Seller Status)
  {
    path: '/',
    element: <ProtectedRoute />, 
    children: [
      // FIX: Do not use "...SellerRoutes.children". 
      // Use the object directly to ensure <SellerLayout> is rendered.
      SellerRoutes 
    ]
  },
  
  // 3. Fallback Route (404)
  { 
    path: '*', 
    element: <Navigate to="/auth/login" replace />
  }
]);

export default router;