import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  checkAuthStatus 
} from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/account');
      return true;
    }
    return false;
  };

  const register = async (userData) => {
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/auth/login');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const checkAuth = () => {
    dispatch(checkAuthStatus());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
};

export default useAuth;