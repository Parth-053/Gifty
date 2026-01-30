import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const { seller, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;

  // 1. Not Logged In
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  // 2. New User (Partial Registration)
  if (!seller) return <Navigate to="/auth/register" replace />;

  // 3. Pending Approval Check
  if (seller.status === "pending") {
     if (location.pathname !== "/auth/pending-approval") {
         return <Navigate to="/auth/pending-approval" replace />;
     }
     return <Outlet />;
  }

  // 4. Approved -> Dashboard
  return <Outlet />;
};

export default ProtectedRoute;