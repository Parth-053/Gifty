import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";

const PendingApproval = () => {
  const { user, checkStatus } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Auto-Redirect if status becomes Approved
  useEffect(() => {
    if (user?.status === "approved") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkStatus(); // Calls Redux thunk to update user state
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
        <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center">
          <ClockIcon className="h-12 w-12 text-yellow-600" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Application Pending
        </h2>
        
        <p className="text-gray-600 text-lg">
          Thanks for registering, <strong>{user?.storeName}</strong>!
        </p>

        <div className="bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-800">
          <p className="mb-2"><strong>What happens next?</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Our team is reviewing your details.</li>
            <li>Verification typically takes 24-48 hours.</li>
            <li>You will receive an email upon approval.</li>
          </ul>
        </div>

        <Button 
          onClick={handleRefresh} 
          isLoading={refreshing}
          className="w-full"
        >
          Check Status
        </Button>
        
        {/* Signout button removed as requested */}
      </div>
    </div>
  );
};

export default PendingApproval;