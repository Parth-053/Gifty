import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { validateIFSC } from '../../utils/validateForm';

const BankDetails = () => {
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateIFSC(bank.ifscCode)) return toast.error("Invalid IFSC Code");

    try {
      setLoading(true);
      await api.put('/seller/profile/bank', bank);
      toast.success('Bank details updated for payouts!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
         <ShieldCheck className="text-blue-600 shrink-0" size={20} />
         <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Please ensure your bank details are correct. All your earnings will be transferred to this account. Inaccurate details may lead to payment delays.
         </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
         <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Account Holder Name</label>
            <input type="text" value={bank.accountName} onChange={(e) => setBank({...bank, accountName: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
         </div>
         {/* Account Number, IFSC, Bank Name follow same pattern */}
         <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verify & Save Bank Account'}
         </button>
      </form>
    </div>
  );
};

export default BankDetails;