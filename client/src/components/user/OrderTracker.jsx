import React from 'react';
import { Check, X } from 'lucide-react';

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderTracker = ({ status }) => {
  // Normalize status
  const currentStepIndex = steps.indexOf(status);
  const isCancelled = status === 'Cancelled';
  const isReturned = status === 'Returned';

  if (isCancelled) {
    return (
      <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-700 font-bold justify-center">
        <div className="bg-red-100 p-1 rounded-full"><X size={20} /></div>
        Order Cancelled
      </div>
    );
  }

  if (isReturned) {
    return (
      <div className="w-full bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3 text-orange-700 font-bold justify-center">
        <div className="bg-orange-100 p-1 rounded-full"><X size={20} /></div>
        Order Returned
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 overflow-hidden">
      <div className="relative flex justify-between items-center">
        
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full mx-2 sm:mx-4" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-700 ease-out rounded-full mx-2 sm:mx-4"
          style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2 w-1/4">
              <div 
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white scale-100 sm:scale-110' 
                    : 'bg-white border-gray-200 text-gray-300'
                  }
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={4} /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
              </div>
              <span 
                className={`
                  text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center
                  ${isCurrent ? 'text-green-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;