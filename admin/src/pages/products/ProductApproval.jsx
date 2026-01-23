import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPendingProducts } from "../../store/productSlice";

import ProductTable from "../../components/tables/ProductTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const ProductApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingList, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchPendingProducts());
  }, [dispatch]);

  const handleView = (id) => {
    // Redirect to details page where Approve/Reject buttons will be visible
    navigate(`/products/${id}?mode=approval`);
  };

  if (loading && pendingList.length === 0) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review and verify new product listings from sellers.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Error: {error}</div>
      )}

      {pendingList.length > 0 ? (
        <ProductTable products={pendingList} onView={handleView} isPending={true} />
      ) : (
        !loading && (
          <EmptyState 
            title="No pending approvals" 
            description="All products have been reviewed. Good job!" 
          />
        )
      )}
    </div>
  );
};

export default ProductApproval;