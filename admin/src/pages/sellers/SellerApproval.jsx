import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPendingSellers } from "../../store/sellerSlice";

import SellerTable from "../../components/tables/SellerTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const SellerApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingSellers, loading, error } = useSelector((state) => state.sellers);

  useEffect(() => {
    dispatch(fetchPendingSellers());
  }, [dispatch]);

  const handleView = (id) => {
    // Navigate to details page with approval mode flag
    navigate(`/sellers/${id}?mode=approval`);
  };

  if (loading && pendingSellers.length === 0) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review new seller registration requests.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Error: {error}</div>
      )}

      {pendingSellers.length > 0 ? (
        <SellerTable sellers={pendingSellers} onView={handleView} isPending={true} />
      ) : (
        !loading && (
          <EmptyState 
            title="No pending requests" 
            description="All seller applications have been processed." 
          />
        )
      )}
    </div>
  );
};

export default SellerApproval;