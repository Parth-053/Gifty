import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PendingApproval from "../pages/auth/PendingApproval";
import useAuth from "../hooks/useAuth";

const AuthRoutes = () => {
  const { isAuthenticated, isPending } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Pending Page Logic:
         - Accessible ONLY if logged in AND status is pending/rejected.
         - If not logged in, redirect to Login.
      */}
      <Route 
        path="/pending-approval" 
        element={
          isAuthenticated && isPending ? <PendingApproval /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Default Catch-All:
         - If logged in & pending -> Go to Pending Page
         - Otherwise -> Go to Login
      */}
      <Route 
        path="*" 
        element={
          isAuthenticated && isPending ? <Navigate to="/pending-approval" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AuthRoutes;