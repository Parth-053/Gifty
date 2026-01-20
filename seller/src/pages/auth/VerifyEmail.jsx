import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, RefreshCw, Loader2 } from 'lucide-react';
import { verifySellerEmail, clearAuthError } from '../../store/authSlice';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const email = location.state?.email || "your email";
  const { loading, isEmailVerified } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isEmailVerified) {
      navigate('/', { replace: true });
    }
  }, [isEmailVerified, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

const handleVerify = async (e) => {
  e.preventDefault();
  const enteredOtp = otp.join('');
  if (enteredOtp.length !== 6) return toast.error("Enter 6-digit code");

  const resultAction = await dispatch(verifySellerEmail({ 
    email: location.state?.email, 
    otp: enteredOtp 
  }));

  if (verifySellerEmail.fulfilled.match(resultAction)) {
    toast.success("Account Verified!");
    navigate('/auth/login');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-8">OTP sent to <span className="font-bold text-gray-800">{email}</span></p>

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index} ref={(el) => (inputRefs.current[index] = el)}
                type="text" maxLength={1} value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 border border-gray-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            ))}
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Account"}
          </button>
        </form>

        <button className="mt-6 flex items-center justify-center gap-2 mx-auto text-sm font-bold text-blue-600 hover:underline">
          <RefreshCw size={16} /> Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;