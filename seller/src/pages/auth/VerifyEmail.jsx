import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmailAction } from "../../store/authSlice";
import Loader from "../../components/common/Loader";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  // Firebase sends the code as 'oobCode' in the URL query
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (oobCode) {
      dispatch(verifyEmailAction(oobCode));
    }
  }, [oobCode, dispatch]);

  // If someone accesses this page without a code
  if (!oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Invalid Link</h3>
          <p className="mt-1 text-gray-500">The verification link is invalid or missing.</p>
          <div className="mt-6">
            <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center border border-gray-200">
          
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <Loader className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Verifying...</h3>
              <p className="text-gray-500 mt-2">Please wait while we verify your email address.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-6">
              <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-red-600 mb-6 bg-red-50 px-4 py-2 rounded">{error}</p>
              <Link to="/auth/login">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                  Return to Login
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckBadgeIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-8">
                Your email has been successfully verified. Your account is now secure.
              </p>
              <Link
                to="/auth/login"
                className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
              >
                Continue to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;