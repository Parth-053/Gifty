import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  { q: "How do I track my order?", a: "Go to Account > Orders > Select Order to see the live tracking status." },
  { q: "Can I customize the gift after ordering?", a: "No, once the order is placed, customization details cannot be changed. Please cancel and re-order." },
  { q: "What is the return policy?", a: "Personalized gifts are non-returnable unless they arrive damaged." },
  { q: "How do I use a coupon?", a: "You can apply coupons at the Cart page before checkout." }
];

const Help = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      
      {/* Header - Connected via useNavigate */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Help & Support</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Contact Options */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="bg-green-50 text-green-600 p-3 rounded-full"><MessageCircle size={24} /></div>
              <span className="text-xs font-bold text-gray-700">Live Chat</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><Mail size={24} /></div>
              <span className="text-xs font-bold text-gray-700">Email Us</span>
           </div>
        </div>

        {/* FAQ Section */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Frequently Asked Questions</h3>
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {FAQS.map((faq, index) => (
                 <div key={index} className="border-b border-gray-50 last:border-none">
                    <button 
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center p-4 text-left"
                    >
                       <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                       {openIndex === index ? <ChevronUp size={16} className="text-[#FF6B6B]" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    
                    {/* Answer Dropdown */}
                    {openIndex === index && (
                       <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed animate-fade-in">
                          {faq.a}
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
           <p className="text-xs text-gray-400">Customer Support: +91 98765 43210</p>
           <p className="text-[10px] text-gray-300 mt-1">Available 9 AM - 6 PM (Mon-Sat)</p>
        </div>

      </div>
    </div>
  );
};

export default Help;