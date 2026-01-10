import React, { useState } from 'react';
import { Landmark, CreditCard, ShieldCheck } from 'lucide-react';
import Toast from '../../components/common/Toast';

const BankDetails = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [bank, setBank] = useState({
    accountName: 'John Doe',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Civil Lines, Jaipur'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Bank details updated successfully!' });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bank Details</h1>
        <p className="text-sm text-gray-500">For payouts and withdrawals.</p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
         <ShieldCheck className="text-blue-600 shrink-0" size={20} />
         <div>
            <h4 className="text-sm font-bold text-blue-800">Secure Information</h4>
            <p className="text-xs text-blue-600 mt-1">
               Your bank details are encrypted and stored securely. This account will be used for all your earnings payouts.
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
         
         <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Holder Name</label>
            <input 
              type="text" 
              value={bank.accountName}
              onChange={(e) => setBank({...bank, accountName: e.target.value})}
              className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
            />
         </div>

         <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
            <div className="relative">
               <CreditCard className="absolute top-3 left-3 text-gray-400" size={18} />
               <input 
                 type="password" 
                 value={bank.accountNumber}
                 onChange={(e) => setBank({...bank, accountNumber: e.target.value})}
                 className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium tracking-widest"
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IFSC Code</label>
               <input 
                 type="text" 
                 value={bank.ifscCode}
                 onChange={(e) => setBank({...bank, ifscCode: e.target.value})}
                 className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium uppercase"
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
               <div className="relative">
                  <Landmark className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={bank.bankName}
                    onChange={(e) => setBank({...bank, bankName: e.target.value})}
                    className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                  />
               </div>
            </div>
         </div>

         <button 
           type="submit" 
           disabled={loading}
           className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-all disabled:opacity-70 mt-2"
         >
            {loading ? 'Verifying & Saving...' : 'Save Bank Details'}
         </button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BankDetails;