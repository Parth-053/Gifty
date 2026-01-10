import React from 'react';
import { Download, CheckCircle, Clock } from 'lucide-react';

const Payouts = () => {
  const payouts = [
    { id: 'PAY-101', seller: 'TechWorld', amount: 12500, status: 'Pending', date: 'Oct 25, 2025' },
    { id: 'PAY-100', seller: 'FashionHub', amount: 8400, status: 'Processed', date: 'Oct 20, 2025' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Seller Payouts</h1>
           <p className="text-sm text-gray-500">Manage settlements to vendors.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold">
           Process Payouts
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Payout ID</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payouts.map((pay) => (
              <tr key={pay.id}>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{pay.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pay.seller}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{pay.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{pay.amount}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${
                    pay.status === 'Processed' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {pay.status === 'Processed' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                    {pay.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 text-sm font-bold hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;