import { useSelector, useDispatch } from 'react-redux';
import { logoutSeller, clearAuthError } from '../store/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    
    // 1. Fetch state from Redux store
    const { seller, isAuthenticated, loading, error, isEmailVerified } = useSelector((state) => state.auth);
    
    return {
        // --- State Data ---
        user: seller, // Alias 'seller' to 'user' for generic usage if needed
        seller,
        loading,
        error,
        
        // --- Flags ---
        isAuthenticated,
        isEmailVerified,
        
        // Check for specific statuses
        isPending: seller?.status === 'pending',
        isApproved: seller?.status === 'approved',
        isRejected: seller?.status === 'rejected',

        // --- Actions ---
        handleLogout: () => dispatch(logoutSeller()),
        clearErrors: () => dispatch(clearAuthError())
    };
};