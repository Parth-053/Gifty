import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Bag' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Payment' },
];

const CheckoutSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                    ${isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <span 
                  className={`
                    absolute top-10 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap
                    ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-12 sm:w-24 h-0.5 mx-2 transition-colors duration-300
                    ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;