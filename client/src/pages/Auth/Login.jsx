// client/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check Verification Status
            if (!user.emailVerified) {
                toast("Please verify your email first.", { icon: '📧' });
                navigate('/verify-email');
            } else {
                toast.success("Welcome back!");
                navigate('/'); 
            }
        } catch (error) {
            console.error(error);
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Logged in with Google!");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Google login failed");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Gifty</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <input 
                        type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                        className="w-full p-3 border rounded-lg"
                    />
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-between">
                   <hr className="w-full border-gray-300" />
                   <span className="px-2 text-gray-500 text-sm">OR</span>
                   <hr className="w-full border-gray-300" />
                </div>

                <button onClick={handleGoogleLogin} className="w-full mt-4 border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    Sign in with Google
                </button>

                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold">Sign up</Link>
                </p>
                <p className="mt-2 text-center text-sm">
                    <Link to="/forgot-password" className="text-gray-500 hover:underline">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;