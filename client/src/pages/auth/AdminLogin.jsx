import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dummy Login Simulation
    setTimeout(() => {
      setLoading(false);
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        localStorage.setItem('adminToken', 'dummy-admin-token');
        navigate('/dashboard');
      } else {
        alert('Invalid Credentials! (Try: admin@example.com / admin123)');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Secure access for store management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link to="/auth/forgot-password" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;