import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayouts, processPayout } from "../../store/financeSlice";

// Components
import PayoutTable from "../../components/tables/PayoutTable";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Payouts = () => {
  const dispatch = useDispatch();
  const { payouts, totalPayouts, loading, error } = useSelector((state) => state.finance);
  
  // Local State
  const [page, setPage] = useState(1);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchPayouts({ page, limit }));
  }, [dispatch, page]);

  const handleProcessClick = (payout) => {
    setSelectedPayout(payout);
    setProcessModalOpen(true);
  };

  const confirmProcess = async () => {
    if (selectedPayout) {
      // Dispatch action to mark as Completed
      // Note: Backend logic for actual bank transfer depends on your integration
      await dispatch(processPayout({ 
        id: selectedPayout._id, 
        status: "Completed",
        note: "Processed via Admin Panel" 
      }));
      
      setProcessModalOpen(false);
      setSelectedPayout(null);
      // Refresh list
      dispatch(fetchPayouts({ page, limit }));
    }
  };

  if (loading && payouts.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading payouts..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Payouts</h1>
        <p className="mt-1 text-sm text-gray-500">Manage withdrawal requests from sellers.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Table */}
      {payouts.length > 0 ? (
        <>
          <PayoutTable payouts={payouts} onProcess={handleProcessClick} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={totalPayouts}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        !loading && (
          <EmptyState
            title="No payouts found"
            description="Pending withdrawal requests will appear here."
          />
        )
      )}

      {/* Process Confirmation Modal */}
      <ConfirmDialog
        isOpen={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        onConfirm={confirmProcess}
        title="Approve Payout?"
        message={`Are you sure you want to mark payout ${selectedPayout?.payoutId} as Completed? Ensure the funds have been transferred manually if required.`}
        isLoading={loading}
      />
    </div>
  );
};

export default Payouts;