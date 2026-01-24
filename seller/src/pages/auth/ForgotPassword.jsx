import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendResetLink, clearError } from "../../store/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(sendResetLink(email));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your registered email to receive reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {successMessage ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800">Check your inbox</h3>
              <p className="mt-2 text-sm text-green-700">
                We have sent a password reset link to <strong>{email}</strong>.
              </p>
              <div className="mt-6">
                <Link to="/auth/login">
                  <Button variant="secondary">Back to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                icon={EnvelopeIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seller@example.com"
              />

              <Button type="submit" isLoading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}

          {!successMessage && (
            <div className="mt-6 flex justify-center">
              <Link to="/auth/login" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;