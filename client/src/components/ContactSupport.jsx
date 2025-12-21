const ContactSupport = () => {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        Contact Us
      </h2>

      <div className="bg-white rounded-2xl shadow-sm divide-y">
        <div className="px-4 py-3 flex items-center gap-3 cursor-pointer">
          💬 <span className="text-sm">Chat with Support</span>
        </div>

        <div className="px-4 py-3 flex items-center gap-3 cursor-pointer">
          📧 <span className="text-sm">Email Support</span>
        </div>

        <div className="px-4 py-3 flex items-center gap-3 cursor-pointer">
          📞 <span className="text-sm">Call Support</span>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
