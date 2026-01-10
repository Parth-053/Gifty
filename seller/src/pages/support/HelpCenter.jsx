import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react';

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: "How do I process an order?", answer: "Go to the Orders tab, select the order, and change the status from 'Pending' to 'Processing' or 'Shipped'." },
    { question: "When will I receive my payout?", answer: "Payouts are processed every Wednesday for the previous week's delivered orders directly to your bank account." },
    { question: "How can I update my bank details?", answer: "Go to Profile > Bank Details to update your account information securely." },
    { question: "Can I delete a product?", answer: "Yes, you can delete a product from the Products tab, but it is recommended to disable it instead if it has past orders." },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900">How can we help you?</h1>
        <div className="relative max-w-lg mx-auto">
           <Search className="absolute top-3.5 left-4 text-gray-400" size={20} />
           <input 
             type="text" 
             placeholder="Search for help..." 
             className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* FAQ Section */}
         <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
               <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-all">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-4 text-left font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                     {faq.question}
                     {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === index && (
                     <div className="p-4 pt-0 text-sm text-gray-500 leading-relaxed border-t border-gray-50 bg-gray-50/30">
                        {faq.answer}
                     </div>
                  )}
               </div>
            ))}
         </div>

         {/* Contact Card */}
         <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Support</h2>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={24} />
               </div>
               <h3 className="font-bold text-gray-800">Live Chat</h3>
               <p className="text-xs text-gray-500 mt-1 mb-4">Chat with our support team in real-time.</p>
               <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                  Start Chat
               </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={24} />
               </div>
               <h3 className="font-bold text-gray-800">Email Us</h3>
               <p className="text-xs text-gray-500 mt-1 mb-4">Get response within 24 hours.</p>
               <button className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                  Send Email
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default HelpCenter;