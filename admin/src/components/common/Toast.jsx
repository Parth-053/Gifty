import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose, duration = 3000 }) => {
  
  // Auto-close timer
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Toast Styles based on Type
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="text-green-500" size={20} />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="text-red-500" size={20} />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="text-blue-500" size={20} />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px] ${currentStyle.bg} ${currentStyle.border}`}>
        
        {/* Icon */}
        <div className="shrink-0">
          {currentStyle.icon}
        </div>

        {/* Message */}
        <p className={`flex-1 text-sm font-semibold ${currentStyle.text}`}>
          {message}
        </p>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className={`p-1 rounded-full hover:bg-white/50 transition-colors ${currentStyle.text}`}
        >
          <X size={16} />
        </button>

      </div>
    </div>
  );
};

export default Toast;