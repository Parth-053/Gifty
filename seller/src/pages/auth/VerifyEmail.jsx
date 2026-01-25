import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../config/firebase';
import { reload } from 'firebase/auth';
import { finalizeRegistration, resendVerificationEmail, syncSellerProfile } from '../../store/authSlice';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(false);
  const { seller } = useSelector((state) => state.auth);

  useEffect(() => {
    if (seller) navigate('/onboarding');
  }, [seller, navigate]);

  const handleVerifyCheck = async () => {
    setVerifying(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await reload(user); // Firebase status refresh
      
      if (user.emailVerified) {
        // Data retrieve karo
        const storedData = localStorage.getItem("tempRegistrationData");
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Backend me entry banao
          await dispatch(finalizeRegistration(parsedData)).unwrap();
          
          localStorage.removeItem("tempRegistrationData");
          toast.success("Account Verified & Created!");
          navigate("/onboarding");
        } else {
          // Fallback: Agar data lost ho gaya to profile fetch try karo
          await dispatch(syncSellerProfile()).unwrap();
          navigate("/onboarding");
        }
      } else {
        toast.error("Email not verified yet.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Profile missing or sync failed.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    dispatch(resendVerificationEmail()).then(() => toast.success("Link sent!"));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify your Email</h2>
        <p className="text-gray-600 mb-6">
          Check your email: <strong>{auth.currentUser?.email}</strong>.
          <br/>Click the link, then come back and click below.
        </p>
        <Button onClick={handleVerifyCheck} isLoading={verifying}>I have verified my email</Button>
        <button onClick={handleResend} className="mt-4 text-indigo-600 text-sm hover:underline">Resend Link</button>
      </div>
    </div>
  );
};

export default VerifyEmail;