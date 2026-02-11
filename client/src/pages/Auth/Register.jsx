// client/src/pages/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useAuth();

    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        return () => dispatch(clearAuthError());
    }, [dispatch]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerUser(formData)).unwrap();
            toast.success("Account created! Please verify your email.");
            navigate('/verify-email'); 
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Join Gifty</h2>
                
                {error && <div className="bg-red-50 text-red-500 p-3 mb-4 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <input type="tel" name="phone" placeholder="Phone (Optional)" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;