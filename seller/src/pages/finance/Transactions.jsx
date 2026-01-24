import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../store/financeSlice";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { ArrowDownTrayIcon, BanknotesIcon } from "@heroicons/react/24/outline";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading, totalPages, currentPage } = useSelector((state) => state.finance);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit: 10 }));
  }, [dispatch, page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">History of your earnings and deductions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <Loader />
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Credit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn.transactionId || txn.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{txn.transactionId?.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(txn.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                        - {formatPrice(txn.commissionDeducted)} <span className="text-xs text-gray-400">({txn.commissionRate}%)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                        + {formatPrice(txn.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(p) => setPage(p)} 
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <BanknotesIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
            <p className="text-gray-500 mt-1">Once you fulfill orders, your earnings will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;