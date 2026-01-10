import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth'; // बाद में जब हुक रेडी हो

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dummy Login Logic
    setTimeout(() => {
      setLoading(false);
      // डमी टोकन सेव करें
      localStorage.setItem('sellerToken', 'dummy-token-123');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage your store & orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="seller@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link to="/auth/forgot-password" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-500">
          New to SellerHub?{' '}
          <Link to="/auth/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;