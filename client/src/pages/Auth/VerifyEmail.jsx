// client/src/pages/Auth/VerifyEmail.jsx
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

  // Retrieve the data passed from the Register component
  const registrationData = location.state;

  // Protect the route: if someone directly types /verify-email in URL, send them back to register
  useEffect(() => {
    if (!registrationData || !registrationData.formData?.email) {
        navigate('/register');
    }
  }, [navigate, registrationData]);

  if (!registrationData) return null; // Prevent UI flicker before redirect

  const { formData, addressData } = registrationData;

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("OTP must be exactly 6 digits.");
    
    setLoading(true);
    try {
        // 1. Verify OTP with Backend
        await api.post('/auth/verify-otp', { email: formData.email, otp });
        
        // 2. If valid, actually create the Firebase & MongoDB Account
        await dispatch(registerUser({ ...formData, addressData })).unwrap();
        
        toast.success("Account created successfully!");
        navigate('/'); // Instantly redirect to home!
    } catch (err) {
        toast.error(err.response?.data?.message || err || "Invalid or Expired OTP.");
    } finally {
        setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: formData.email });
      toast.success("New verification code sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-500 mb-8">
          We've sent a 6-digit code to <br/>
          <span className="font-semibold text-gray-800">{formData.email}</span>
        </p>

        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <input 
                type="text" 
                maxLength="6" 
                placeholder="000000" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only allow numbers
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
            className="w-full mt-6 text-sm text-blue-600 hover:underline font-bold"
        >
            Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;