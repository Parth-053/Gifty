import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../store/financeSlice";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// Components
import TransactionTable from "../../components/tables/TransactionTable";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import StatsCard from "../../components/common/StatsCard";
import EmptyState from "../../components/common/EmptyState";
import formatCurrency from "../../utils/formatCurrency";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, totalTransactions, loading, error } = useSelector((state) => state.finance);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit }));
  }, [dispatch, page]);

  // Calculate Total Volume (Client side approximation or fetch from backend analytics)
  const totalVolume = transactions.reduce((acc, curr) => acc + (curr.status === 'success' ? curr.amount : 0), 0);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor all incoming payments and refunds.</p>
      </div>

      {/* Quick Stats Row (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Recent Volume (Page)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Count</p>
          <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading transactions: {error}
        </div>
      )}

      {/* Table Content */}
      {transactions.length > 0 ? (
        <>
          <TransactionTable transactions={transactions} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={totalTransactions}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        !loading && (
          <EmptyState
            title="No transactions found"
            description="All payment records will appear here."
          />
        )
      )}
    </div>
  );
};

export default Transactions;