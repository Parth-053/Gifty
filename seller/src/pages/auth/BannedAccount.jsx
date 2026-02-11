import React from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";

const BannedAccount = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-6 border-t-4 border-red-600">
        
        {/* Warning Icon */}
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Account Suspended
        </h2>
        
        <p className="text-gray-600 text-lg">
          Hello <strong>{user?.storeName || "Seller"}</strong>,
        </p>

        {/* Info Box */}
        <div className="bg-red-50 p-4 rounded-lg text-left text-sm text-red-800 border border-red-100">
          <p className="mb-2"><strong>Why am I seeing this?</strong></p>
          <p className="mb-2">
            Your seller account has been temporarily suspended by the administration. This may be due to a violation of our terms of service or unusual account activity.
          </p>
          <p>
            While your account is suspended, your store is hidden from the platform and you cannot manage your inventory or orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <a href="mailto:admin@gifty.com" className="w-full">
            <Button className="w-full">Contact Admin Support</Button>
          </a>
          <Button variant="outline" onClick={logout} className="w-full">
            Sign Out
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default BannedAccount;