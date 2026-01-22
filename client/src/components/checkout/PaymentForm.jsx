import React, { useState } from 'react';
import { CreditCard, Smartphone, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import Button from '../common/Button';

const PaymentForm = ({ onPaymentSubmit, loading, totalAmount }) => {
  const [method, setMethod] = useState('online'); // 'online' | 'cod'

  const handleSubmit = () => {
    onPaymentSubmit(method);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>

      <div className="space-y-3">
        {/* Option 1: Online Payment */}
        <label 
          className={`
            flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${method === 'online' 
              ? 'border-blue-600 bg-blue-50/50' 
              : 'border-gray-100 hover:border-blue-200'
            }
          `}
        >
          <input 
            type="radio" 
            name="payment" 
            value="online" 
            checked={method === 'online'}
            onChange={() => setMethod('online')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-green-600">
            <CreditCard size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Pay Online (UPI / Cards)</p>
            <p className="text-xs text-green-600 font-medium mt-0.5">Extra 5% discount applied automatically</p>
          </div>
        </label>

        {/* Option 2: Cash on Delivery */}
        <label 
          className={`
            flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${method === 'cod' 
              ? 'border-blue-600 bg-blue-50/50' 
              : 'border-gray-100 hover:border-blue-200'
            }
          `}
        >
          <input 
            type="radio" 
            name="payment" 
            value="cod" 
            checked={method === 'cod'}
            onChange={() => setMethod('cod')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-orange-600">
            <Truck size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
            <p className="text-xs text-gray-500 mt-0.5">Pay in cash when order is delivered</p>
          </div>
        </label>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center gap-2 justify-center text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
        <ShieldCheck size={14} />
        Payments are 100% encrypted & secure
      </div>

      <Button 
        onClick={handleSubmit} 
        isLoading={loading}
        fullWidth 
        size="lg"
      >
        {method === 'cod' ? `Place Order` : `Pay Now`}
      </Button>
    </div>
  );
};

export default PaymentForm;