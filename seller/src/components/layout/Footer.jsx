import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        <p className="text-xs text-gray-500">
          © {currentYear} <span className="font-bold text-gray-700">SellerApp</span>. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link to="/support" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
            Help Center
          </Link>
          <Link to="/privacy" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;