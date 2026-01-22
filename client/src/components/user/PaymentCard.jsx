import React from 'react';
import { Trash2, CreditCard } from 'lucide-react';

const PaymentCard = ({ method, onDelete }) => {
  // Determine card brand style (simplified)
  const getBrandStyle = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'from-blue-700 to-blue-900';
      case 'mastercard': return 'from-red-700 to-orange-600';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className={`relative w-full h-48 rounded-2xl bg-gradient-to-br ${getBrandStyle(method.brand)} text-white p-6 shadow-lg transform transition-transform hover:scale-[1.02] overflow-hidden`}>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
      
      <div className="flex justify-between items-start h-full flex-col relative z-10">
        
        {/* Header */}
        <div className="flex justify-between w-full items-center">
          <CreditCard className="opacity-80" size={24} />
          {onDelete && (
            <button 
              onClick={() => onDelete(method._id)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Card Number */}
        <div className="flex gap-4 items-center mt-4">
          <span className="text-xl tracking-widest font-mono">•••• •••• ••••</span>
          <span className="text-xl font-mono tracking-widest">{method.last4}</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end w-full mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Card Holder</p>
            <p className="text-sm font-bold tracking-wide uppercase">{method.name || 'User Name'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-70">Expires</p>
            <p className="text-sm font-bold font-mono">{method.expMonth}/{method.expYear}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;