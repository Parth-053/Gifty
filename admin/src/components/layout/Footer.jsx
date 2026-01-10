import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-8 border-t border-gray-100 bg-white">
      <p className="text-xs text-center text-gray-500">
        © {currentYear} <span className="font-bold text-gray-700">AdminPanel</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;