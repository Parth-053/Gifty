import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../store/financeSlice';
import { Search } from 'lucide-react';
import Loader from '../../components/common/Loader';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.finance);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1 }));
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 rounded-lg py-2">
           <Search size={18} className="text-gray-400" />
           <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{txn._id.substring(0, 10)}...</td>
                <td className="px-6 py-4 text-sm text-blue-600">#{txn.orderId || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{txn.amount}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${txn.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {txn.type.toUpperCase()}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="p-6 text-center text-gray-500">No transactions found.</div>}
      </div>
    </div>
  );
};

export default Transactions;