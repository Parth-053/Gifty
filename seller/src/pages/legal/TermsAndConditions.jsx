import React from 'react';
import { ScrollText, ShieldAlert, Scale, CheckCircle } from 'lucide-react';

const TermsAndConditions = () => {
  const sections = [
    { title: "1. Seller Eligibility", content: "To sell on Gifty, you must be a registered business entity in India with a valid GSTIN (if applicable) and a functional bank account." },
    { title: "2. Product Quality & Authenticity", content: "All products must be original and match the description provided. Counterfeit or low-quality goods will result in immediate account suspension." },
    { title: "3. Commission & Fees", content: "Gifty charges a platform fee of 10% on every successful order. Payouts are released after a 7-day return window is closed." },
    { title: "4. Shipping & Fulfillment", content: "Sellers are responsible for packing items securely. Orders must be handed over to our logistics partner within 48 hours of acceptance." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-3xl text-white shadow-xl">
        <ScrollText size={48} className="mb-4 opacity-80" />
        <h1 className="text-3xl font-black mb-2">Seller Agreement</h1>
        <p className="text-blue-100 text-sm">Last updated: October 2025 • Version 2.4</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-black">{idx + 1}</span>
              {section.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex gap-4">
        <ShieldAlert className="text-orange-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-orange-900 text-sm">Legal Disclaimer</h4>
          <p className="text-xs text-orange-800 mt-1 leading-relaxed">
            Violation of these terms may lead to permanent banning of your store and freezing of pending payouts for legal investigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;