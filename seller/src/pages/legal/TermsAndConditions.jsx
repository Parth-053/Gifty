import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6 text-gray-700 leading-relaxed">
        <p className="text-sm text-gray-500">Last updated: January 24, 2026</p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
          <p>
            Welcome to Gifty Seller Portal. By registering as a seller, you agree to comply with and be bound by the following terms and conditions of use, which govern Gifty's relationship with you in relation to this website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Seller Obligations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You agree to provide accurate, current, and complete information during the registration process.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>You must ensure that all products listed comply with local laws and do not infringe on any third-party intellectual property rights.</li>
            <li>You agree to fulfill orders within the stipulated time frame mentioned in your product listing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Fees and Payments</h2>
          <p>
            Gifty charges a commission fee on every successful sale. The commission rate varies by category and is deducted automatically before the payout is processed to your bank account. Payouts are processed weekly for orders that have completed the return window.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Returns and Refunds</h2>
          <p>
            Sellers must adhere to Gifty's return policy. If a customer receives a damaged or incorrect product, you are liable to accept the return or provide a replacement. Repeated failure to adhere to quality standards may result in account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Account Termination</h2>
          <p>
            Gifty reserves the right to terminate or suspend your seller account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the platform, us, or third parties, or for any other reason.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            For any questions regarding these terms, please contact us at <a href="mailto:legal@gifty.com" className="text-indigo-600 hover:underline">legal@gifty.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;