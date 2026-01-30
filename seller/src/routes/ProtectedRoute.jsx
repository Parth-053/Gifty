import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const { seller, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 1. Partial Register (404 Case)
  if (!seller) {
    return <Navigate to="/auth/register" replace />;
  }

  // 2. Pending Approval Check
  if (seller.status === "pending") {
     // If already on pending page, don't redirect loop
     if (location.pathname === "/auth/pending-approval") {
         return <Outlet />;
     }
     return <Navigate to="/auth/pending-approval" replace />;
  }
  
  // 3. Rejected Check (Optional)
  if (seller.status === "rejected") {
      // You might want a specific rejected page
      return <Navigate to="/auth/login" replace />; 
  }

  // 4. Approved -> Dashboard
  return <Outlet />;
};

export default ProtectedRoute;