import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  // Helper to check specific roles if needed later
  const isAdmin = user?.role === "admin";

  return { 
    user, 
    isAuthenticated, 
    loading, 
    error,
    isAdmin 
  };
};

export default useAuth;