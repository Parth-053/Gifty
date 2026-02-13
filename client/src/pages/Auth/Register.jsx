import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, clearAuthError } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ 
        fullName: '', 
        email: '', 
        password: '', 
        phone: '' 
    });

    useEffect(() => {
        if (error) toast.error(error);
        return () => dispatch(clearAuthError());
    }, [dispatch, error]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
            return toast.error("Please fill all fields");
        }

        try {
            await dispatch(sendOtp({ email: formData.email })).unwrap();
            
            toast.success("Verification code sent!");
            
            navigate('/verify-email', { 
                state: { 
                    registrationData: { formData: formData } 
                } 
            });
        } catch (err) {
            console.error("OTP Error:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Join us to find the perfect gifts</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input name="fullName" type="text" required className="appearance-none rounded-xl block w-full px-10 py-3 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Full Name" value={formData.fullName} onChange={handleFormChange} />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input name="email" type="email" required className="appearance-none rounded-xl block w-full px-10 py-3 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleFormChange} />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input name="phone" type="tel" required className="appearance-none rounded-xl block w-full px-10 py-3 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Phone Number" value={formData.phone} onChange={handleFormChange} />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input name="password" type="password" required className="appearance-none rounded-xl block w-full px-10 py-3 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleFormChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70">
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Sending Code...</> : <>Create Account <ArrowRight size={18} /></>}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">Already have an account? Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;