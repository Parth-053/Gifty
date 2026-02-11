// client/src/pages/Auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useDispatch } from 'react-redux';
import { syncUser } from '../../store/authSlice';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  // Auto-check if email is verified
  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); 
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          // Crucial: Sync with backend so MongoDB sets isEmailVerified: true
          await dispatch(syncUser()).unwrap(); 
          toast.success("Email Verified! Redirecting...");
          navigate('/'); 
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, dispatch, user]);

  const handleResend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification link sent again!");
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        toast.error("Please wait a bit before requesting again.");
      } else {
        toast.error("Failed to send link.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Prevent flicker before redirect

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
          We've sent a verification link to <br/>
          <span className="font-semibold text-gray-800">{user.email}</span>
        </p>

        <div className="space-y-3">
          <button disabled className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">
            Waiting for verification...
          </button>

          <button 
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;