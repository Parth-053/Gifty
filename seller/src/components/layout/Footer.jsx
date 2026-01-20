import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants'; //

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 px-6 border-t border-gray-100 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-900">{APP_NAME}</p>
          <p className="text-xs text-gray-400 mt-1">
            © {currentYear} All rights reserved. Empowerment for local sellers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          <Link to="/support" className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
            Help Center
          </Link>
          <Link to="/legal/privacy" className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/legal/terms" className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;