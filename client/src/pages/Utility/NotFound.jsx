import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      
      <div className="-mt-12 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <Link 
          to="/"
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg"
        >
          <Home size={18} /> Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;