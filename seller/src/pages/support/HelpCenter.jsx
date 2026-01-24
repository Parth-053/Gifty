import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none hover:bg-gray-50 px-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Orders & Shipping",
      items: [
        { q: "How do I process an order?", a: "Go to the Orders tab, select the order, and click on 'Process'. Once packed, mark it as 'Ready to Ship'." },
        { q: "What if a customer requests a cancellation?", a: "If the order hasn't been shipped, you can approve the cancellation from the Order Details page. If shipped, advise the customer to reject delivery." },
      ]
    },
    {
      category: "Payments & Finance",
      items: [
        { q: "When will I receive my payout?", a: "Payouts are processed every Wednesday for orders delivered at least 7 days ago." },
        { q: "How is the commission calculated?", a: "Commission is a percentage of the selling price, varying by category. Check your 'Finance' tab for detailed breakdowns." },
      ]
    },
    {
      category: "Account Management",
      items: [
        { q: "How do I update my bank details?", a: "Navigate to Settings > Bank Details to update your account information." },
        { q: "Can I change my shop name?", a: "Yes, you can update your shop name in the 'Store Settings' section." },
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <div className="max-w-xl mx-auto relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for questions..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 transition">
          <BookOpenIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Seller Guide</h3>
          <p className="text-sm text-gray-600 mt-1">Read detailed documentation</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl flex flex-col items-center text-center cursor-pointer hover:bg-green-100 transition">
          <CurrencyRupeeIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Commission Rates</h3>
          <p className="text-sm text-gray-600 mt-1">View current fee structure</p>
        </div>
        <Link to="/support/contact" className="bg-indigo-50 p-6 rounded-xl flex flex-col items-center text-center cursor-pointer hover:bg-indigo-100 transition">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Contact Support</h3>
          <p className="text-sm text-gray-600 mt-1">Get in touch with us</p>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        {filteredFaqs.length > 0 ? (
          <div className="space-y-8">
            {filteredFaqs.map((category, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {category.category}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item, i) => (
                    <FaqItem key={i} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;