// client/src/hooks/useAuth.jsx
import { useSelector } from 'react-redux';

export const useAuth = () => {
  // Directly returns { user, isAuthenticated, loading, error } from Redux
  return useSelector((state) => state.auth);
};

export default useAuth;