// client/src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const user = auth.currentUser;

  // 1. Auto-check every 3 seconds if email is verified
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Refresh user data from Firebase
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          toast.success("Email Verified! Redirecting...");
          navigate('/'); // Go to Home/Dashboard
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 2. Resend Verification Link
  const handleResend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification link sent again!");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/too-many-requests') {
        toast.error("Please wait a bit before requesting again.");
      } else {
        toast.error("Failed to send link.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Manual Check Button
  const handleManualCheck = async () => {
    setChecking(true);
    if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
            toast.success("Verified!");
            navigate('/');
        } else {
            toast.error("Not verified yet. Please check your inbox (and spam).");
        }
    }
    setChecking(false);
  };

  // 4. Logout (in case they want to use another account)
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) {
      navigate('/login');
      return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-500 mb-8">
          We've sent a verification link to <br/>
          <span className="font-semibold text-gray-800">{user.email}</span>
        </p>

        <div className="space-y-3">
          <button 
            onClick={handleManualCheck}
            disabled={checking}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            {checking ? "Checking..." : "I've Verified My Email"}
          </button>

          <button 
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            {loading ? "Sending..." : "Resend Verification Link"}
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-8 text-sm text-gray-500 hover:text-red-600 hover:underline"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;