import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Terms & Privacy</h1>
      
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2>
          <p>Welcome to Gifty. By using our website, you agree to these terms...</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Privacy Policy</h2>
          <p>We take your privacy seriously. We only collect data necessary to process your orders and improve your shopping experience...</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Returns & Refunds</h2>
          <p>You can return any non-customized item within 7 days of delivery. Customized items created using our AI tool are non-refundable unless defective.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;