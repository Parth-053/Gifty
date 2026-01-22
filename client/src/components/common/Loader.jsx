import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = 40, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={size} />
        <p className="text-sm font-bold text-gray-500 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  );
};

export default Loader;