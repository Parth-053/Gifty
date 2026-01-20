import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isPending } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen text="Verifying session..." />;

  // 1. Not Logged In - Redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isPending) {
    return <Navigate to="/auth/pending-approval" replace />;
  }

  return children;
};

export default ProtectedRoute;