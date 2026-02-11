// client/src/pages/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Reset link sent!");
    } catch (error) {
      let errorMsg = "Failed to send reset link.";
      if (error.code === 'auth/user-not-found') errorMsg = "No account found with this email.";
      if (error.code === 'auth/invalid-email') errorMsg = "Invalid email address.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Check your email</h2>
          <p className="text-gray-500 mb-8">
            We have sent password reset instructions to <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          <Link to="/login" className="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="bg-gray-900 p-8 text-center relative">
          <Link to="/login" className="absolute left-6 top-8 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-black text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm">No worries, we'll send you reset instructions.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-gray-900 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;