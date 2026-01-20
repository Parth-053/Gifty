import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { question: "How do I process an order?", answer: "Go to the Orders tab, select the order, and change the status from 'Pending' to 'Processing' or 'Shipped'. Once delivered, mark it as 'Completed'." },
    { question: "When will I receive my payout?", answer: "Payouts are processed every Wednesday for the previous week's delivered orders directly to your verified bank account." },
    { question: "How can I update my bank details?", answer: "Go to Profile > Bank Details to update your account information. Note: This may require admin re-verification for security." },
    { question: "Can I delete a product?", answer: "Yes, you can delete a product from the Products list. However, if the product has existing orders, we recommend marking it as 'Inactive' instead." },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Search Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-black text-gray-900">How can we help you?</h1>
        <p className="text-gray-500">Search for help articles or contact our support team.</p>
        <div className="relative max-w-lg mx-auto">
           <Search className="absolute top-3.5 left-4 text-gray-400" size={20} />
           <input 
              type="text" 
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* FAQ Section */}
         <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
               <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                     <span className="font-bold text-gray-700 text-sm">{faq.question}</span>
                     {openFaq === index ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  {openFaq === index && (
                     <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.answer}
                     </div>
                  )}
               </div>
            )) : (
              <p className="text-gray-400 italic text-sm py-10 text-center">No matching questions found.</p>
            )}
         </div>

         {/* Contact Sidebar */}
         <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Support</h2>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <MessageCircle size={24} />
               </div>
               <h3 className="font-bold text-gray-800">Live Chat</h3>
               <p className="text-xs text-gray-500 mt-1 mb-4">Available Mon-Sat, 10 AM - 6 PM</p>
               <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                  Start Chat
               </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Mail size={24} />
               </div>
               <h3 className="font-bold text-gray-800">Email Us</h3>
               <p className="text-xs text-gray-500 mt-1 mb-4">We respond within 24 hours.</p>
               <a href="mailto:support@gifty.com" className="block w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg">
                  Send Email
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;