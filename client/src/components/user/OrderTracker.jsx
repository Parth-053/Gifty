import React from 'react';
import { Check } from 'lucide-react';

const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

const OrderTracker = ({ currentStatus }) => {
  // Logic to find current step index
  const getCurrentStepIndex = () => {
    if (currentStatus === "Cancelled") return -1;
    return steps.indexOf(currentStatus) === -1 ? 1 : steps.indexOf(currentStatus);
  };

  const activeIndex = getCurrentStepIndex();

  return (
    <div className="py-6 px-2">
      <div className="flex items-center justify-between relative">
        {/* Grey Background Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        
        {/* Active Color Line */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps Nodes */}
        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold z-10 
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                {isCompleted ? <Check size={14} /> : index + 1}
              </div>
              <p className={`text-[10px] mt-2 font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
      
      {currentStatus === "Cancelled" && (
        <div className="mt-4 bg-red-50 text-red-600 text-xs font-bold p-2 text-center rounded">
          This order has been Cancelled.
        </div>
      )}
    </div>
  );
};

export default OrderTracker;