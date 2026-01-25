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

  // Zombie State Check
  if (!seller) {
    return <div className="p-10 text-center">Loading Profile...</div>; 
  }

  const isOnboardingPage = location.pathname === "/onboarding";
  const isProfileComplete = seller?.onboardingCompleted;

  if (!isProfileComplete && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isProfileComplete && isOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;