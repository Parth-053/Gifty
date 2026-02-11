import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PendingApproval from "../pages/auth/PendingApproval";
import BannedAccount from "../pages/auth/BannedAccount"; // <-- Import the new Banned page
import useAuth from "../hooks/useAuth";

const AuthRoutes = () => {
  const { isAuthenticated, isPending, user } = useAuth(); // Extracted 'user'

  // Determine if the user is suspended or banned
  const isBanned = user?.status === "suspended" || user?.status === "banned";

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

      {/* Banned Page Logic:
         - Accessible ONLY if logged in AND status is suspended/banned.
         - If not logged in, redirect to Login.
      */}
      <Route 
        path="/banned" 
        element={
          isAuthenticated && isBanned ? <BannedAccount /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Default Catch-All:
         - If logged in & banned -> Go to Banned Page
         - If logged in & pending -> Go to Pending Page
         - Otherwise -> Go to Login
      */}
      <Route 
        path="*" 
        element={
          isAuthenticated && isBanned ? <Navigate to="/banned" replace /> :
          isAuthenticated && isPending ? <Navigate to="/pending-approval" replace /> : 
          <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AuthRoutes;