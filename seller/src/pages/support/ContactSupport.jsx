import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "General Inquiry",
    message: "",
    attachment: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // In real app: dispatch(sendSupportTicket(form));
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-8 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <PaperAirplaneIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for contacting us. Our support team will get back to you within 24 hours.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/support" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border"
            >
              <option>General Inquiry</option>
              <option>Order Issue</option>
              <option>Payment/Payout</option>
              <option>Technical Problem</option>
              <option>Account Verification</option>
            </select>
          </div>

          <Input 
            label="Subject" 
            name="subject" 
            value={form.subject} 
            onChange={handleChange} 
            placeholder="Brief summary of your issue"
            required 
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3"
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={loading} className="w-full sm:w-auto">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;