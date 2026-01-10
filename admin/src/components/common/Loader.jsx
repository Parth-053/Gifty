import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-gray-600 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
    </div>
  );
};

export default Loader;