import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose, duration = 3000 }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`fixed top-5 right-5 z-[60] flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full animate-slide-in-right ${currentStyle.bg} ${currentStyle.border}`}>
      <div className="flex-shrink-0 mt-0.5">
        {currentStyle.icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${currentStyle.text}`}>
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className={`p-1 rounded-md hover:bg-black/5 transition-colors ${currentStyle.text}`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;