import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6 text-gray-700 leading-relaxed">
        <p className="text-sm text-gray-500">Effective Date: January 24, 2026</p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Data Collection</h2>
          <p>
            We collect personal information such as your name, contact details, bank account information, and GSTIN when you register as a seller on Gifty. We also collect data regarding your sales, transactions, and interactions with customers on our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Use of Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Facilitate your seller account creation and management.</li>
            <li>Process payments and payouts.</li>
            <li>Communicate with you regarding orders, policy updates, and support.</li>
            <li>Analyze platform performance and improve our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. However, we may share necessary information with third-party service providers (e.g., logistics partners, payment gateways) to facilitate order fulfillment and payments. We may also disclose information if required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or update your personal information directly through your seller dashboard. If you wish to delete your account, please contact our support team.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;