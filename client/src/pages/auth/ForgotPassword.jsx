import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Recovery Mode</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your admin email to reset password.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-green-800 font-medium">Check your inbox! Recovery link sent.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;