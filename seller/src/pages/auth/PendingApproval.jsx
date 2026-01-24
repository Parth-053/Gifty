import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200 text-center">
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 mb-6">
          <ClockIcon className="h-10 w-10 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Application Under Review</h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for registering with Gifty! Your seller account has been created and is currently pending approval from our admin team.
        </p>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left mb-8">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">What happens next?</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span>We will verify your business details.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span>You will receive an email once approved.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span>Typical review time: 24-48 hours.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            to="/auth/login" 
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
          >
            Refresh Status
          </Link>
          <a 
            href="mailto:support@gifty.com"
            className="text-sm text-gray-500 hover:text-gray-900 font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;