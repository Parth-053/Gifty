import { createBrowserRouter, Link } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import SellerRoutes from './SellerRoutes';

const router = createBrowserRouter([ 
  AuthRoutes,
  SellerRoutes,
  
  // 404 Fallback
  { 
    path: '*', 
    element: (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-black text-gray-900">404</h1>
        <p className="text-gray-500 font-medium mb-4">Page Not Found</p>
        <Link to="/dashboard" className="text-blue-600 font-bold hover:underline">
          Go back home
        </Link>
      </div>
    )
  }
]);

export default router;