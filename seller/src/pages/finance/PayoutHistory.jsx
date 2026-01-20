import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Landmark, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { fetchPayoutHistory } from '../../store/financeSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const PayoutHistory = () => {
  const dispatch = useDispatch();
  const { payouts, loading } = useSelector((state) => state.finance);

  useEffect(() => {
    dispatch(fetchPayoutHistory());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payout History</h1>
          <p className="text-sm text-gray-500">View and track all payments transferred to your bank.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Payout ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">UTR Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payouts.length > 0 ? payouts.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">#{item.payoutId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase">
                    <Landmark size={14} className="text-gray-400" /> {item.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-black text-gray-900">{formatPrice(item.amount)}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(item.status)}`}>
                      {item.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{item.transactionReference || '---'}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="py-20 text-center text-gray-400 italic">No payout records found yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutHistory;