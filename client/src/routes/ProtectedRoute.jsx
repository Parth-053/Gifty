import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // We will use the custom hook
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  // Use the AuthContext hook instead of Redux
  const { user, loading } = useAuth(); 

  if (loading) {
    return <Loader fullScreen text="Verifying session..." />;
  }

  if (!user) {
    // Redirect to login but remember the page they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: If you want to force email verification before accessing dashboard
  // if (!user.emailVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  return children;
};

export default ProtectedRoute;