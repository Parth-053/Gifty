import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Store, Mail, Lock, ArrowRight, Phone, FileText, Loader2 } from 'lucide-react';
import { registerSeller } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { validateGST, validatePassword, validatePhone } from '../../utils/validateForm';
import toast from 'react-hot-toast';


const InputField = ({ icon: Icon, type, name, placeholder, label, value, onChange, required = true }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    email: '',
    phone: '',
    gstin: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      return toast.error("Please enter a valid 10-digit phone number");
    }
    if (!validatePassword(formData.password)) {
      return toast.error("Password must be 8+ chars with uppercase, number & symbol");
    }
    if (formData.gstin && !validateGST(formData.gstin)) {
      return toast.error("Invalid GSTIN format");
    }

    const resultAction = await dispatch(registerSeller(formData));
    
    if (registerSeller.fulfilled.match(resultAction)) {
      toast.success("Account created! Please verify your email.");
      navigate('/auth/verify-email', { state: { email: formData.email } });
    } else {
      toast.error(resultAction.payload || "Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4 py-12">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Seller Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join Gifty and reach thousands of customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField 
            label="Full Name" icon={User} type="text" name="fullName" 
            placeholder="Asmita ..." value={formData.fullName} onChange={handleChange} 
          />
          <InputField 
            label="Store Name" icon={Store} type="text" name="storeName" 
            placeholder="My Gift Shop" value={formData.storeName} onChange={handleChange} 
          />
          <InputField 
            label="Email Address" icon={Mail} type="email" name="email" 
            placeholder="asmita@example.com" value={formData.email} onChange={handleChange} 
          />
          <InputField 
            label="Phone Number" icon={Phone} type="text" name="phone" 
            placeholder="9876543210" value={formData.phone} onChange={handleChange} 
          />
          <InputField 
            label="GSTIN (Optional)" icon={FileText} type="text" name="gstin" 
            placeholder="22AAAAA0000A1Z5" required={false} value={formData.gstin} onChange={handleChange} 
          />
          <InputField 
            label="Password" icon={Lock} type="password" name="password" 
            placeholder="••••••••" value={formData.password} onChange={handleChange} 
          />

          <div className="md:col-span-2 flex items-start gap-2 mt-2">
            <input type="checkbox" required className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <p className="text-xs text-gray-500">
              I agree to the <Link to="/legal/terms" className="text-blue-600 font-bold hover:underline">Seller Agreement</Link> and <Link to="/legal/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-70 transform active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register Store <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have a seller account? <Link to="/auth/login" className="font-bold text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;