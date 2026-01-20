import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { forgotPassword } from '../../store/authSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const dispatch = useDispatch();
  // Get loading state from Redux auth slice
  const { loading } = useSelector((state) => state.auth);

  /**
   * Handles the form submission to request a password reset link
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error("Please enter your email address");
    }

    // Dispatching the forgotPassword thunk
    const resultAction = await dispatch(forgotPassword(email));
    
    if (forgotPassword.fulfilled.match(resultAction)) {
      setIsSubmitted(true);
      toast.success("Reset link sent successfully!");
    } else {
      // Show backend error message or default fallback
      toast.error(resultAction.payload || "Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {!isSubmitted ? (
          /* --- Request Reset Link State --- */
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Mail size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mt-2">
                No worries! Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                    placeholder="seller@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-70 transform active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          /* --- Success Confirmation State --- */
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We have sent password recovery instructions to:<br />
              <strong className="text-gray-800">{email}</strong>
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Try another email address
            </button>
          </div>
        )}

        {/* --- Back to Login Footer --- */}
        <div className="mt-8 text-center pt-6 border-t border-gray-50">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;