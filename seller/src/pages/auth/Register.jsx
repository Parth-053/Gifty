// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Store, Mail, Lock, ArrowRight, Phone, FileText, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import api from "../../api/axios"; // Direct API call for syncing profile data
import { validateGST, validatePassword, validatePhone } from '../../utils/validateForm';
import toast from 'react-hot-toast';

// Helper Component for Inputs
const InputField = ({ icon: Icon, type, name, placeholder, label, value, onChange, required = true }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type={type} name={name} required={required} value={value} onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', storeName: '', email: '', phone: '', gstin: '', password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    if (!validatePhone(formData.phone)) return toast.error("Invalid phone number");
    if (!validatePassword(formData.password)) return toast.error("Weak password (Use Uppercase, Symbol, Number)");
    if (formData.gstin && !validateGST(formData.gstin)) return toast.error("Invalid GSTIN");

    setLoading(true);

    try {
      // 2. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // 3. Update Firebase Display Name
      await updateProfile(firebaseUser, { displayName: formData.fullName });

      // 4. Send Extra Data to MongoDB
      // Note: We use the fresh token from firebaseUser
      const token = await firebaseUser.getIdToken();
      
      await api.post('/auth/register-seller', {
        fullName: formData.fullName,
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        gstin: formData.gstin,
        firebaseUid: firebaseUser.uid,
        role: 'seller' 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Store Registered! Please verify email.");
      // Navigate or let AuthContext handle redirection
      navigate('/auth/verify-email'); // You might need to trigger sendEmailVerification() here

    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email already in use.");
      } else {
        toast.error("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
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
          <InputField label="Full Name" icon={User} type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
          <InputField label="Store Name" icon={Store} type="text" name="storeName" placeholder="My Shop" value={formData.storeName} onChange={handleChange} />
          <InputField label="Email Address" icon={Mail} type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          <InputField label="Phone Number" icon={Phone} type="text" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} />
          <InputField label="GSTIN (Optional)" icon={FileText} type="text" name="gstin" placeholder="GSTIN..." required={false} value={formData.gstin} onChange={handleChange} />
          <InputField label="Password" icon={Lock} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />

          <button
            type="submit" disabled={loading}
            className="md:col-span-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register Store <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account? <Link to="/auth/login" className="font-bold text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;