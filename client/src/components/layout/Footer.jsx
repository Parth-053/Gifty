import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Footer = () => {
  return (
    // pb-20 on mobile to clear the BottomNav
    <footer className="bg-white border-t border-gray-100 pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900">{APP_NAME}.</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your one-stop destination for personalized gifts and curated collections. Making moments special.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={Instagram} />
            <SocialIcon icon={Twitter} />
            <SocialIcon icon={Facebook} />
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/shop" className="hover:text-blue-600">New Arrivals</Link></li>
            <li><Link to="/shop?sort=bestsellers" className="hover:text-blue-600">Best Sellers</Link></li>
            <li><Link to="/shop?category=custom" className="hover:text-blue-600">Custom Gifts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/user/orders" className="hover:text-blue-600">Order Status</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
            <li><Link to="/legal/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            <li><Link to="/support" className="hover:text-blue-600">Help Center</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@gifty.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }) => (
  <a href="#" className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all">
    <Icon size={18} />
  </a>
);

export default Footer;