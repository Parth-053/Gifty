import React from 'react';
import { Lock, Eye, Database, Globe } from 'lucide-react';

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
    <div className="prose prose-blue text-gray-600 text-sm space-y-6">
      <p>At <span className="font-bold">Gifty</span>, we value your privacy. We collect seller data like GSTIN, bank details, and warehouse addresses solely for order processing and payouts.</p>
      
      <h3 className="text-lg font-bold text-gray-800">Data Security</h3>
      <p>All sensitive information, including your bank account details, is encrypted using industry-standard SSL protocols and is never shared with third-party buyers.</p>
      
      <h3 className="text-lg font-bold text-gray-800">Third-Party Disclosure</h3>
      <p>We only share your address and contact details with our authorized logistics partners to facilitate order delivery.</p>
    </div>
  </div>
);

export default PrivacyPolicy;