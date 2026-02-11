// client/src/pages/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            if (!user.isEmailVerified) {
                navigate('/verify-email');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => dispatch(clearAuthError());
    }, [dispatch]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loggedUser = await dispatch(loginUser({ email, password })).unwrap();
            if (!loggedUser.isEmailVerified) {
                toast("Please verify your email.", { icon: '📧' });
                navigate('/verify-email');
            } else {
                toast.success("Welcome back!");
                navigate('/'); 
            }
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Gifty</h2>
                
                {error && <div className="bg-red-50 text-red-500 p-3 mb-4 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <input 
                        type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
                </p>
                <p className="mt-2 text-center text-sm">
                    <Link to="/forgot-password" className="text-gray-500 hover:underline">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;