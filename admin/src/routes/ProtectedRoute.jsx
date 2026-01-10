import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader fullScreen text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;