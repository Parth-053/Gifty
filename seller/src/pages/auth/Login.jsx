import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../config/firebase";
import { syncSeller } from "../../store/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { seller, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && seller) {
      if (seller.status === "approved") {
        navigate("/dashboard");
      } else if (seller.status === "pending") {
        navigate("/pending-approval");
      }
    }
  }, [isAuthenticated, seller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Login (Variable removed to fix lint error)
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. Backend Sync
      const resultAction = await dispatch(syncSeller());
      
      if (syncSeller.fulfilled.match(resultAction)) {
        const sellerData = resultAction.payload;
        
        toast.success("Welcome back! 👋");

        // 3. Manual Redirect
        if (sellerData.status === "approved") {
          navigate("/dashboard");
        } else {
          navigate("/pending-approval");
        }
      } else {
        toast.error("Seller account not found.");
        auth.signOut();
      }

    } catch (error) {
      console.error("Login Error:", error);
      let msg = "Failed to login.";
      if (error.code === "auth/invalid-credential") msg = "Invalid email or password.";
      if (error.code === "auth/user-not-found") msg = "No account found with this email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            G
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Seller Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            register a new seller account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="mt-1 text-right">
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;