// client/src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import api from "../../api/axios"; 
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create User
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Update Name
            await updateProfile(user, { displayName: formData.fullName });

            // 3. Send Verification Email (New Step)
            await sendEmailVerification(user);

            // 4. Sync with Backend
            const token = await user.getIdToken();
            await api.post('/auth/sync', { 
                idToken: token,
                additionalData: {
                    phone: formData.phone,
                    fullName: formData.fullName
                }
            });

            toast.success("Account created! Please verify your email.");
            // Change: Redirect to verify page instead of home
            navigate('/verify-email'); 

        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email is already registered");
            } else {
                toast.error("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Join Gifty</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <input 
                        type="text" name="fullName" placeholder="Full Name" 
                        value={formData.fullName} onChange={handleChange} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <input 
                        type="email" name="email" placeholder="Email" 
                        value={formData.email} onChange={handleChange} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <input 
                        type="tel" name="phone" placeholder="Phone (Optional)" 
                        value={formData.phone} onChange={handleChange} 
                        className="w-full p-3 border rounded-lg"
                    />
                    <input 
                        type="password" name="password" placeholder="Password" 
                        value={formData.password} onChange={handleChange} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    
                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;