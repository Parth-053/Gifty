import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-gray-500 mb-8">
            Have questions about your order or want to collaborate? We'd love to hear from you.
          </p>

          <div className="space-y-6">
            <ContactItem icon={Mail} title="Email" value="support@gifty.com" />
            <ContactItem icon={Phone} title="Phone" value="+91 98765 43210" />
            <ContactItem icon={MapPin} title="Office" value="123 Innovation Dr, Tech City, India" />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" placeholder="Your Name" required />
            <Input label="Email" type="email" placeholder="you@company.com" required />
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
              <textarea 
                rows="4"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                placeholder="How can we help?"
                required
              />
            </div>

            <Button type="submit" fullWidth isLoading={loading} icon={Send}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Contact;