import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth'; // Uncomment when Auth Hook is ready

const ProtectedRoute = ({ children }) => {
  // Dummy logic until hook is connected
  // const { isAuthenticated, isLoading } = useAuth();
  
  // 🔥 DUMMY: Assume user is logged in if token exists in localStorage
  const isAuthenticated = localStorage.getItem('sellerToken') ? true : false;
  const isLoading = false; 

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /auth/login page, but save the current location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;