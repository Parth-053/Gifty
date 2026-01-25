import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import SellerRoutes from './SellerRoutes';
import ProtectedRoute from './ProtectedRoute';
import Onboarding from '../pages/auth/Onboarding';  

const router = createBrowserRouter([ 
  // 1. Public Routes (Login, Register, etc.)
  AuthRoutes,

  // 2. Protected Routes (Require Login)
  {
    element: <ProtectedRoute />, 
    children: [
      // Onboarding Route (Standalone, No Sidebar)
      { 
        path: '/onboarding', 
        element: <Onboarding /> 
      },

      // Dashboard Routes (With Sidebar Layout)
      SellerRoutes
    ]
  },
  
  { 
    path: '*', 
    element: (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-black text-gray-900">404</h1>
        <p className="text-gray-500 font-medium mb-4">Page Not Found</p>
        <a href="/dashboard" className="text-blue-600 font-bold hover:underline">
          Go back home
        </a>
      </div>
    )
  }
]);

export default router;