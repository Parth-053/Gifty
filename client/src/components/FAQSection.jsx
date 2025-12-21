const faqs = [
  "How can I customize my gift?",
  "What is the delivery time?",
  "How do I track my order?",
  "What is the return policy?",
];

const FAQSection = () => {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        Frequently Asked Questions
      </h2>

      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {faqs.map((q, index) => (
          <div
            key={index}
            className="px-4 py-3 text-sm cursor-pointer"
          >
            {q}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
