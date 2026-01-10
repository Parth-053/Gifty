import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Store, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dummy Register Logic
    setTimeout(() => {
      setLoading(false);
      alert("Registration Successful! Please Login.");
      navigate('/auth/login');
    }, 1500);
  };

  // Reusable Input Component
  const InputField = ({ icon: Icon, type, name, placeholder, label }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type={type}
          name={name}
          required
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Become a Seller</h1>
          <p className="text-gray-500 text-sm mt-2">Join thousands of sellers & grow your business.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <InputField 
            label="Full Name"
            icon={User} 
            type="text" 
            name="fullName" 
            placeholder="John Doe" 
          />
          
          <InputField 
            label="Store Name"
            icon={Store} 
            type="text" 
            name="storeName" 
            placeholder="John's Gift Shop" 
          />

          <InputField 
            label="Email Address"
            icon={Mail} 
            type="email" 
            name="email" 
            placeholder="seller@example.com" 
          />

          <InputField 
            label="Password"
            icon={Lock} 
            type="password" 
            name="password" 
            placeholder="Create a strong password" 
          />

          <div className="flex items-start gap-2 mt-2">
            <input type="checkbox" required className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <p className="text-xs text-gray-500">
              I agree to the <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform active:scale-[0.98]"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-bold text-gray-900 hover:text-black hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;