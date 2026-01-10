import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 Digit OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  
  const inputRefs = useRef([]);

  // Timer Logic for Resend
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Input Change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    // 🔥 Dummy Verification
    setTimeout(() => {
      setLoading(false);
      alert("Email Verified Successfully!");
      navigate('/dashboard');
    }, 1500);
  };

  const handleResend = () => {
    setTimer(30);
    alert("New code sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        
        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={28} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-8">
          We've sent a verification code to <span className="font-bold text-gray-800">seller@example.com</span>
        </p>

        <form onSubmit={handleVerify}>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-300 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? 'Verifying...' : 'Verify Email'} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-sm">
          <p className="text-gray-500 mb-2">Didn't receive the code?</p>
          {timer > 0 ? (
            <span className="text-gray-400 font-medium">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <button 
              onClick={handleResend}
              className="flex items-center justify-center gap-1 mx-auto font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <RefreshCw size={14} /> Resend Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;