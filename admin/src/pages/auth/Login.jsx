import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { fetchAdminProfile } from "../../store/authSlice"; 
import useForm from "../../hooks/useForm";
import { validateEmail, validatePassword } from "../../utils/validation";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  // Form Validation Logic
  // Optimization: Moved inside but ideally should be outside or useCallback to prevent re-creation
  const validate = (values) => {
    const errors = {};
    if (!validateEmail(values.email)) errors.email = "Invalid email address";
    if (!validatePassword(values.password)) errors.password = "Password must be at least 6 characters";
    return errors;
  };

  // Use Custom Hook
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    validate
  );

  const onSubmit = async (formValues) => {
    setAuthError(null);
    try {
      // 1. Firebase Login
      await signInWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );

      // 2. Sync with Backend & Get Profile
      const resultAction = await dispatch(fetchAdminProfile());

      if (fetchAdminProfile.fulfilled.match(resultAction)) {
        const adminData = resultAction.payload;
        
        // 3. Verify Role (Security Check)
        // FIXED: Added optional chaining (adminData.role OR adminData.user.role)
        // This handles cases where backend returns { user: { role: 'admin' } }
        const role = adminData?.role || adminData?.user?.role;
        
        if (role !== "admin") {
          throw new Error("Access Denied: You do not have admin privileges.");
        }

        // 4. Success -> Redirect
        navigate("/dashboard");
      } else {
        throw new Error(resultAction.payload || "Failed to fetch admin profile");
      }
    } catch (error) {
      console.error("Login Error:", error);
      let message = "Login failed. Please check your credentials.";
      
      // Handle Firebase specific errors
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      } else if (error.message) {
        message = error.message;
      }
      
      setAuthError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Gifty Admin Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
            
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="admin@gifty.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Global Error Message */}
            {authError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{authError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;