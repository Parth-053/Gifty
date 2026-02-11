// client/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth(); 

  if (loading) return <Loader fullScreen text="Verifying session..." />;

  // Must be logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Must have a verified email to access protected areas
  if (!user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;