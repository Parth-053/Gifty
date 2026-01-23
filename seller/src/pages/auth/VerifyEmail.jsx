// src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, Loader2, LogOut } from 'lucide-react';
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check if user is already verified every few seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Refresh user state from Firebase
        if (user.emailVerified) {
          toast.success("Email Verified!");
          navigate('/'); // Redirect to dashboard
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification link sent again!");
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        toast.error("Please wait before requesting again.");
      } else {
        toast.error("Failed to send link.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate('/auth/login');
  };

  const checkManually = async () => {
    setChecking(true);
    const user = auth.currentUser;
    await user.reload();
    if (user?.emailVerified) {
      navigate('/');
    } else {
      toast.error("Not verified yet. Please check your inbox.");
    }
    setChecking(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          We've sent a verification link to<br/>
          <span className="font-bold text-gray-800">{auth.currentUser?.email}</span>
        </p>

        <div className="space-y-3">
          <button 
            onClick={checkManually} 
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all"
          >
            {checking ? <Loader2 className="animate-spin" size={18} /> : "I've Clicked the Link"}
          </button>

          <button 
            onClick={handleResend} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><RefreshCw size={18} /> Resend Link</>}
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-8 text-sm text-gray-500 hover:text-red-600 font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;