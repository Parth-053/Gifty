import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      // Simulate API Call
      if (email === "seller@example.com" && password === "123456") {
        setTimeout(() => {
          const dummyUser = { name: "John Doe", email, role: "seller" };
          const dummyToken = "abc-123-xyz";
          
          dispatch(loginSuccess({ user: dummyUser, token: dummyToken }));
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  const signout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return { user, isAuthenticated, loading, error, login, signout };
};