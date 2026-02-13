import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Safe Access: Check if state exists before accessing properties
  const registrationData = location.state;
  const email = registrationData?.formData?.email; // Safely get email

  // 1. REDIRECT CHECK: If no email found (e.g., page refresh), go back to register
  useEffect(() => {
    if (!email) {
        toast.error("Session expired. Please register again.");
        navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  // 2. STOP RENDER: Don't render anything if email is missing to prevent crash
  if (!email) return null; 

  const { formData, addressData } = registrationData;

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("OTP must be exactly 6 digits.");
    
    setLoading(true);
    try {
        await api.post('/auth/verify-otp', { email, otp });
        await dispatch(registerUser({ ...formData, addressData })).unwrap();
        
        toast.success("Account verified! Logging you in...");
        navigate('/');
    } catch (error) {
        console.error("Verification failed:", error);
        toast.error(typeof error === 'string' ? error : "Verification failed");
    } finally {
        setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
        await api.post('/auth/send-otp', { email });
        toast.success("New code sent!");
    } catch (error) {
        toast.error("Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-500 mb-8">
          We've sent a 6-digit code to <br/>
          {/* 3. FIX: Use the safely extracted 'email' variable */}
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <input 
                type="text" 
                maxLength="6" 
                placeholder="000000" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                required 
                className="w-full p-3 border rounded-lg text-center tracking-[0.5em] text-2xl font-bold" 
            />
            
            <button 
                type="submit" 
                disabled={loading || otp.length < 6} 
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
            >
                {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
        </form>

        <button 
            type="button" 
            onClick={handleResend} 
            disabled={loading}
            className="mt-6 text-sm text-gray-600 hover:text-gray-900 underline"
        >
            Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;