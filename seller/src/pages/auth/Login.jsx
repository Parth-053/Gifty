import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSeller, clearError } from "../../store/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Access auth state from Redux
  const { loading, error, isAuthenticated, seller } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  // Handle successful login and redirection based on seller status
  useEffect(() => {
    if (isAuthenticated && seller) {
      if (seller.status === "pending") {
        navigate("/auth/pending");
      } else if (seller.status === "rejected" || seller.status === "suspended") {
        alert("Your account is " + seller.status);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, seller, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginSeller(form));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Seller Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to Gifty Seller Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              icon={EnvelopeIcon}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="seller@example.com"
            />

            <Input
              label="Password"
              type="password"
              icon={LockClosedIcon}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Gifty?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/auth/register">
                <Button variant="secondary">Create a Seller Account</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/legal/terms" className="underline hover:text-indigo-600">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/legal/privacy" className="underline hover:text-indigo-600">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;