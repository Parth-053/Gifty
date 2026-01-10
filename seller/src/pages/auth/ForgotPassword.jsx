import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dummy API Call Simulation
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                  placeholder="seller@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Check your mail</h3>
            <p className="text-sm text-gray-500 mb-6">
              We have sent a password recover instructions to your email <strong>{email}</strong>.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              Try another email
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;