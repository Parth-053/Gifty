import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchAdminProfile } from "../store/authSlice";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, user]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;