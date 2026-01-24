import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  // We only need to read the state now. 
  // App.jsx is responsible for updating it.
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // 1. While App.jsx is checking Firebase (loading is true), show a spinner
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // 2. If checking is done and user is NOT logged in, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in, show the Admin Pages (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;