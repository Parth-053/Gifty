import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';
import Pagination from '../../components/common/Pagination';

const Transactions = () => {
  const transactions = [
    { id: 'TXN-9821', orderId: '#ORD-7829', amount: 1247, status: 'Success', date: 'Oct 24, 2025', gateway: 'Razorpay' },
    { id: 'TXN-9822', orderId: '#ORD-7828', amount: 1299, status: 'Failed', date: 'Oct 23, 2025', gateway: 'UPI' },
    { id: 'TXN-9823', orderId: '#ORD-7827', amount: 699, status: 'Success', date: 'Oct 22, 2025', gateway: 'Card' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 rounded-lg py-2">
           <Search size={18} className="text-gray-400" />
           <input type="text" placeholder="Search Transaction ID..." className="bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Gateway</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{txn.id}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{txn.orderId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.gateway}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{txn.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    txn.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={1} totalPages={10} onPageChange={()=>{}} />
    </div>
  );
};

export default Transactions;