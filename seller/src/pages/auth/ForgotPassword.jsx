// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    setLoading(true);
    try {
      // Config: User should be redirected back to OUR app's reset page
      const actionCodeSettings = {
        // Dynamic URL based on where the app is running (localhost or production)
        url: `${window.location.origin}/auth/reset-password`,
        handleCodeInApp: true,
      };

      // Firebase sends the email with our link
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email.");
      } else {
        toast.error("Failed to send link. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-2">No worries, we'll send you reset instructions.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  placeholder="name@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm shadow-xl transition-all disabled:opacity-70 transform active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We have sent a password reset link to:<br />
              <strong className="text-gray-800">{email}</strong>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Note: The link will redirect you back to this app to set a new password.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Try another email address
            </button>
          </div>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-50">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;