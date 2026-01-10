import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = "medium", text = "Loading..." }) => {
  // Size classes map
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  const spinnerClass = `${sizeClasses[size] || sizeClasses.medium} text-blue-600 animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Loader2 className={spinnerClass} />
        {text && <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={spinnerClass} />
    </div>
  );
};

export default Loader;