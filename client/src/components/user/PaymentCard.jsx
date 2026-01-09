import React from 'react';
import { Trash2, CreditCard } from 'lucide-react';

const PaymentCard = ({ method, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex items-center gap-3">
      {/* Icon based on type */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.type === 'UPI' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
        {method.type === 'UPI' ? <span className="font-bold text-xs">UPI</span> : <CreditCard size={20} />}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-800">{method.name}</h3>
        <p className="text-xs text-gray-500">{method.detail}</p>
      </div>

      <button onClick={() => onDelete(method.id)} className="text-gray-300 hover:text-red-500">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default PaymentCard;