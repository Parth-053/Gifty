import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Navigation Logic
  useEffect(() => {
    if (user) {
      if (user.status === "approved") {
        navigate("/dashboard");
      } else {
        navigate("/pending-approval");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Seller Login</h2>
          <p className="mt-2 text-sm text-gray-600">Access your store dashboard</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have a seller account?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;