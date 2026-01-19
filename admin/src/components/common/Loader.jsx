import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center border border-gray-100">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-bold text-gray-700 animate-pulse">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
      <p className="text-xs text-gray-500 font-medium">{text}</p>
    </div>
  );
};

export default Loader;