import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayouts, requestPayout, clearFinanceMessages } from "../../store/financeSlice";
import { fetchDashboardStats } from "../../store/dashboardSlice";  
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import { BanknotesIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const Payouts = () => {
  const dispatch = useDispatch();
  const { payouts, loading, actionLoading, error, successMessage } = useSelector((state) => state.finance);
  const { stats } = useSelector((state) => state.dashboard); 
  
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    dispatch(fetchPayouts({ page: 1, limit: 20 }));
    dispatch(fetchDashboardStats());
    
    return () => { dispatch(clearFinanceMessages()); };
  }, [dispatch]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount)) return;
    
    // Backend validation logic check
    if (Number(withdrawAmount) < 500) {
      alert("Minimum withdrawal amount is ₹500");
      return;
    }
    
    dispatch(requestPayout(withdrawAmount));
    setWithdrawAmount("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "danger";
      default: return "neutral";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Withdrawal Request Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Request Payout</h2>
          <p className="text-sm text-gray-500 mb-6">Withdraw earnings to your bank account</p>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
            <p className="text-sm text-indigo-700 font-medium">Available Balance</p>
            <p className="text-3xl font-bold text-indigo-900 mt-1">
              {formatPrice(stats?.withdrawableAmount || 0)}
            </p>
          </div>

          {(error || successMessage) && (
            <div className={`p-4 rounded-lg mb-4 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {error || successMessage}
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4">
            <Input
              label="Amount to Withdraw"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Min ₹500"
              required
              min="500"
              max={stats?.withdrawableAmount || 0}
            />
            
            <Button 
              type="submit" 
              isLoading={actionLoading} 
              disabled={!stats?.withdrawableAmount || stats.withdrawableAmount < 500}
              className="w-full"
            >
              Send Request
            </Button>
            
            <p className="text-xs text-gray-400 text-center mt-2">
              Requests are usually processed within 24-48 hours.
            </p>
          </form>
        </div>
      </div>

      {/* Right Column: History Table */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Payout History</h3>
          </div>

          {loading ? (
            <div className="p-12"><Loader /></div>
          ) : payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payouts.map((payout) => (
                    <tr key={payout._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payout.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(payout.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400 font-mono">
                        {payout.transactionId ? payout.transactionId : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <BanknotesIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No payout requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payouts;