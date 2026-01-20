import React from 'react';
import { Box, SearchX } from 'lucide-react';

const EmptyState = ({ 
  title = "No data found", 
  message = "Try adjusting your filters or search.", 
  icon: Icon = Box,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mb-6">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{message}</p>
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;