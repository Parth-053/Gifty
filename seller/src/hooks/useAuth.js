import { useSelector, useDispatch } from "react-redux";
import { 
  loginSeller, 
  registerSeller, 
  logout, 
  syncSeller, // Matches authSlice
  clearError  // Matches authSlice
} from "../store/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  // We use 'seller' from the Redux state
  const { seller, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  return {
    // State
    user: seller, // Alias 'seller' to 'user' for compatibility
    seller,
    loading,
    error,
    isAuthenticated,
    
    // Status Helpers
    isPending: seller?.status === "pending" || seller?.status === "rejected",
    isApproved: seller?.status === "approved",
    
    // Actions
    login: (creds) => dispatch(loginSeller(creds)),
    register: (data) => dispatch(registerSeller(data)),
    logout: () => dispatch(logout()),
    syncSeller: () => dispatch(syncSeller()),
    clearError: () => dispatch(clearError())
  };
};

export default useAuth;