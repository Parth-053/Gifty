import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import api from '../../api/axios'; 
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { syncSellerProfile } from '../../store/authSlice';

const STEPS = { BASIC: 1, ADDRESS: 2, BANK: 3, OTP: 4 };

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // --- Initialize State from Session Storage (Prevents Reset on Reload) ---
  const getInitialState = (key, defaultValue) => {
    try {
      const saved = sessionStorage.getItem('registerState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[key] || defaultValue;
      }
    } catch (e) {
      console.error("Storage parse error", e);
    }
    return defaultValue;
  };

  const [currentStep, setCurrentStep] = useState(() => getInitialState('currentStep', STEPS.BASIC));
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const [basicData, setBasicData] = useState(() => getInitialState('basicData', { 
    fullName: '', storeName: '', email: '', phone: '', password: '', confirmPassword: '' 
  }));
  
  const [addressData, setAddressData] = useState(() => getInitialState('addressData', { 
    street: '', city: '', state: '', pincode: '', country: 'India' 
  }));
  
  const [bankData, setBankData] = useState(() => getInitialState('bankData', { 
    accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', gstin: '' 
  }));

  // --- Persist State on Change ---
  useEffect(() => {
    const stateToSave = { basicData, addressData, bankData, currentStep };
    sessionStorage.setItem('registerState', JSON.stringify(stateToSave));
  }, [basicData, addressData, bankData, currentStep]);

  // --- Handlers ---

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    if (basicData.password !== basicData.confirmPassword) return toast.error("Passwords do not match");
    setCurrentStep(STEPS.ADDRESS);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(STEPS.BANK);
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user = auth.currentUser;
      
      // 1. Ensure User Exists & is Logged In (Firebase)
      if (!user) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, basicData.email, basicData.password);
          user = userCredential.user;
        } catch (authError) {
          if (authError.code === 'auth/email-already-in-use') {
             // If email exists (e.g. they refreshed), log them in to resume
             const loginCredential = await signInWithEmailAndPassword(auth, basicData.email, basicData.password);
             user = loginCredential.user;
          } else {
             throw authError;
          }
        }
      }

      // 2. CRITICAL: Refresh Token to prevent "Token Expired" error
      await user.reload();
      user = auth.currentUser; 
      await user.getIdToken(true); 

      // 3. Update Firebase Display Name
      try {
        await updateProfile(user, { displayName: basicData.fullName });
      } catch (profileError) {
        console.warn("Profile update warning:", profileError);
      }

      // 4. Send OTP from Backend
      await api.post('/auth/send-otp', { email: basicData.email });
      
      toast.success(`OTP sent to ${basicData.email}`);
      setCurrentStep(STEPS.OTP);
      
    } catch (error) {
      console.error("Registration Step Error:", error);
      const msg = error.response?.data?.message || error.message;
      
      if (msg.includes("token-expired") || msg.includes("unauthorized")) {
          toast.error("Session expired. Please refresh page and try again.");
      } else {
          toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 5. Final Registration: Verify OTP -> Create DB Record
      await api.post('/auth/register-seller', {
        otp,
        email: basicData.email,
        fullName: basicData.fullName,
        storeName: basicData.storeName,
        phone: basicData.phone,
        gstin: bankData.gstin,
        address: addressData,
        bankDetails: bankData
      });

      // 6. Success: Clear Storage & Sync
      sessionStorage.removeItem('registerState');
      await dispatch(syncSellerProfile()).unwrap();

      toast.success("Registration Successful!");
      navigate('/auth/pending-approval');

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps ---

  const renderBasicStep = () => (
    <form onSubmit={handleBasicSubmit} className="space-y-4">
       <input type="text" placeholder="Full Name" required value={basicData.fullName} onChange={e=>setBasicData({...basicData, fullName:e.target.value})} className="input-field"/>
       <input type="text" placeholder="Store Name" required value={basicData.storeName} onChange={e=>setBasicData({...basicData, storeName:e.target.value})} className="input-field"/>
       <input type="email" placeholder="Email" required value={basicData.email} onChange={e=>setBasicData({...basicData, email:e.target.value})} className="input-field"/>
       <input type="tel" placeholder="Phone" required value={basicData.phone} onChange={e=>setBasicData({...basicData, phone:e.target.value})} className="input-field"/>
       <input type="password" placeholder="Password" required value={basicData.password} onChange={e=>setBasicData({...basicData, password:e.target.value})} className="input-field"/>
       <input type="password" placeholder="Confirm Password" required value={basicData.confirmPassword} onChange={e=>setBasicData({...basicData, confirmPassword:e.target.value})} className="input-field"/>
       <button type="submit" className="btn-primary w-full">Next: Address Details</button>
    </form>
  );

  const renderAddressStep = () => (
    <form onSubmit={handleAddressSubmit} className="space-y-4">
       <input type="text" placeholder="Street Address" required value={addressData.street} onChange={e=>setAddressData({...addressData, street:e.target.value})} className="input-field"/>
       <div className="grid grid-cols-2 gap-2">
         <input type="text" placeholder="City" required value={addressData.city} onChange={e=>setAddressData({...addressData, city:e.target.value})} className="input-field"/>
         <input type="text" placeholder="State" required value={addressData.state} onChange={e=>setAddressData({...addressData, state:e.target.value})} className="input-field"/>
       </div>
       <input type="text" placeholder="Pincode" required value={addressData.pincode} onChange={e=>setAddressData({...addressData, pincode:e.target.value})} className="input-field"/>
       <button type="submit" className="btn-primary w-full">Next: Bank Details</button>
    </form>
  );

  const renderBankStep = () => (
    <form onSubmit={handleBankSubmit} className="space-y-4">
       <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mb-2">
         Bank details are required to process payouts.
       </div>
       <input type="text" placeholder="GSTIN (Optional)" value={bankData.gstin} onChange={e=>setBankData({...bankData, gstin:e.target.value})} className="input-field"/>
       <input type="text" placeholder="Account Holder Name" required value={bankData.accountHolderName} onChange={e=>setBankData({...bankData, accountHolderName:e.target.value})} className="input-field"/>
       <input type="text" placeholder="Account Number" required value={bankData.accountNumber} onChange={e=>setBankData({...bankData, accountNumber:e.target.value})} className="input-field"/>
       <input type="text" placeholder="IFSC Code" required value={bankData.ifscCode} onChange={e=>setBankData({...bankData, ifscCode:e.target.value})} className="input-field"/>
       <input type="text" placeholder="Bank Name" required value={bankData.bankName} onChange={e=>setBankData({...bankData, bankName:e.target.value})} className="input-field"/>
       <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? <Loader size="sm"/> : "Next: Verify Email"}</button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
      <div className="bg-blue-50 p-4 rounded text-blue-700 mb-4">
        We sent a 6-digit code to <strong>{basicData.email}</strong>.
      </div>
      <input 
        type="text" 
        placeholder="Enter 6-digit OTP" 
        required 
        maxLength="6"
        value={otp} 
        onChange={e=>setOtp(e.target.value)} 
        className="block w-full text-center text-2xl tracking-widest border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <button type="submit" disabled={loading} className="btn-primary w-full mt-4">{loading ? <Loader size="sm"/> : "Verify & Submit Application"}</button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Seller Registration</h2>
        <div className="mt-4 flex justify-center space-x-2">
            {[1, 2, 3, 4].map(step => (
                <div key={step} className={`h-2 w-16 rounded-full ${step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            ))}
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === STEPS.BASIC && renderBasicStep()}
          {currentStep === STEPS.ADDRESS && renderAddressStep()}
          {currentStep === STEPS.BANK && renderBankStep()}
          {currentStep === STEPS.OTP && renderOtpStep()}
          
          {currentStep === STEPS.BASIC && (
            <div className="mt-6 text-center">
                 <p className="text-sm text-gray-600">
                    Already have an account? {' '}
                    <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
                </p>
            </div>
          )}
        </div>
      </div>
       <style>{`
        .input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; margin-bottom: 0.75rem; }
        .btn-primary { background-color: #4f46e5; color: white; padding: 0.5rem; border-radius: 0.375rem; font-weight: 500; }
        .btn-primary:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default Register;