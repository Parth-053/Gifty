import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Admin Login Logic
  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      // 🔥 Simulate API Call
      if (email === "admin@example.com" && password === "admin123") {
        setTimeout(() => {
          const dummyAdmin = { 
            id: 1, 
            name: "Super Admin", 
            email, 
            role: "super_admin", 
            avatar: "https://ui-avatars.com/api/?name=Super+Admin" 
          };
          const dummyToken = "admin-secret-token-123";
          
          dispatch(loginSuccess({ user: dummyAdmin, token: dummyToken }));
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  const signout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return { admin, isAuthenticated, loading, error, login, signout };
};