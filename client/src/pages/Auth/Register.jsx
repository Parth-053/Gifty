// client/src/pages/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAuthError } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error } = useAuth();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 1 Data
    const [formData, setFormData] = useState({ 
        fullName: '', email: '', password: '', phone: '' 
    });

    // Step 2 Data
    const [addressData, setAddressData] = useState({
        addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'Home'
    });

    useEffect(() => {
        return () => dispatch(clearAuthError());
    }, [dispatch]);

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleAddressChange = (e) => setAddressData({ ...addressData, [e.target.name]: e.target.value });

    // Move to Step 2
    const handleNextStep = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password) {
            return toast.error("Please fill in all required fields.");
        }
        setStep(2);
    };

    // Send OTP and Navigate to Verification Page
    const handleSendOtpAndProceed = async (e, isSkip = false) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await api.post('/auth/send-otp', { email: formData.email });
            toast.success(`OTP sent to ${formData.email}`);
            
            // Pass the form data directly to the verify-email page
            navigate('/verify-email', { 
                state: { 
                    formData, 
                    addressData: isSkip ? null : addressData 
                } 
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
            setStep(1); // Go back to step 1 in case email exists
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md relative">
                
                {error && <div className="bg-red-50 text-red-500 p-3 mb-4 rounded text-sm text-center">{error}</div>}

                {/* --- STEP 1: Basic Information --- */}
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">Join Gifty</h2>
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleFormChange} required className="w-full p-3 border rounded-lg" />
                            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleFormChange} required className="w-full p-3 border rounded-lg" />
                            <input type="tel" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleFormChange} className="w-full p-3 border rounded-lg" />
                            <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleFormChange} required className="w-full p-3 border rounded-lg" />
                            
                            <button type="submit" className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-black font-bold mt-2">
                                Continue to Address ➔
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm">
                            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                        </p>
                    </>
                )}

                {/* --- STEP 2: Address Information (Optional) --- */}
                {step === 2 && (
                    <>
                        <button 
                            type="button"
                            onClick={(e) => handleSendOtpAndProceed(e, true)} 
                            disabled={isSubmitting}
                            className="absolute top-6 right-6 text-sm font-bold text-gray-500 hover:text-gray-900"
                        >
                            Skip
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-2">Delivery Address</h2>
                        <p className="text-sm text-gray-500 mb-6">Where should we deliver your gifts?</p>
                        
                        <form onSubmit={(e) => handleSendOtpAndProceed(e, false)} className="space-y-4">
                            <input type="text" name="addressLine1" placeholder="Flat, House no., Building, Company *" value={addressData.addressLine1} onChange={handleAddressChange} required className="w-full p-3 border rounded-lg" />
                            <input type="text" name="addressLine2" placeholder="Area, Street, Sector, Village" value={addressData.addressLine2} onChange={handleAddressChange} className="w-full p-3 border rounded-lg" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="city" placeholder="Town/City *" value={addressData.city} onChange={handleAddressChange} required className="w-full p-3 border rounded-lg" />
                                <input type="text" name="state" placeholder="State *" value={addressData.state} onChange={handleAddressChange} required className="w-full p-3 border rounded-lg" />
                            </div>
                            
                            <input type="text" name="pincode" placeholder="Pincode *" value={addressData.pincode} onChange={handleAddressChange} required className="w-full p-3 border rounded-lg" />
                            
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold mt-4">
                                {isSubmitting ? "Sending Code..." : "Send Verification Code"}
                            </button>
                        </form>

                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            disabled={isSubmitting}
                            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-900"
                        >
                            ← Back to Info
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;