import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[150px] font-extrabold text-gray-200 leading-none select-none">404</h1>
      <div className="-mt-10 mb-8 relative z-10">
         <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
         <p className="text-gray-500 max-w-md mx-auto">The page you are looking for might have been removed or is temporarily unavailable.</p>
      </div>
      <div className="flex gap-4">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <ArrowLeft size={20} /> Go Back
         </button>
         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Home size={20} /> Dashboard
         </button>
      </div>
    </div>
  );
};

export default NotFound;