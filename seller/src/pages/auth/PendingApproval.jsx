import React from 'react';
import { Clock, ShieldCheck, Mail, LogOut, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center animate-fade-in">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Clock size={40} className="animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-3">Registration Under Review</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Thank you for joining <span className="font-bold text-blue-600">Gifty</span>! Our team is currently verifying your documents and store details. This process usually takes <span className="font-bold text-gray-800">24-48 hours</span>.
        </p>

        <div className="space-y-4 mb-8">
           <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-left border border-gray-100">
              <ShieldCheck className="text-green-500 shrink-0" size={20} />
              <p className="text-xs text-gray-600 font-medium">We will notify you via email once your account is active.</p>
           </div>
           <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-left border border-gray-100">
              <Mail className="text-blue-500 shrink-0" size={20} />
              <p className="text-xs text-gray-600 font-medium">Need help? Contact us at <span className="underline">onboarding@gifty.com</span></p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold text-sm hover:text-red-600 transition-colors"
        >
          <LogOut size={18} /> Sign Out & Check Later
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;