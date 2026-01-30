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
      // Redirect root to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },
      
      ...SellerRoutes.children
    ]
  },
  
  // 3. Fallback Route (404)
  { 
    path: '*', 
    element: <Navigate to="/auth/login" replace />
  }
]);

export default router;