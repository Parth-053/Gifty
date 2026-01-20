import { useSelector, useDispatch } from 'react-redux';
import { logout, clearAuthError } from '../store/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    
    // Fetching state from authSlice
    const { user, token, loading, error, isEmailVerified } = useSelector((state) => state.auth);
    
    return {
        // Auth Flags
        isAuthenticated: !!token, 
        
        // Seller Approval Check (Matches backend schema 'status')
        isPending: user?.role === 'seller' && user?.status === 'pending', 
        
        // Email Verification Status
        isEmailVerified: user?.isVerified || isEmailVerified, 
        
        // Data & UI States
        user,
        loading,
        error,

        // Actions
        handleLogout: () => dispatch(logout()),
        clearErrors: () => dispatch(clearAuthError())
    };
};