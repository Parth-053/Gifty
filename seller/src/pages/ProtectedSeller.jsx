import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedSellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== "seller") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedSellerRoute;
