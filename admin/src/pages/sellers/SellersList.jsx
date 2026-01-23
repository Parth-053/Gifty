import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSellers } from "../../store/sellerSlice";

// Components
import SellerTable from "../../components/tables/SellerTable";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Input from "../../components/common/Input";

const SellersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellers, loading, error } = useSelector((state) => state.sellers);

  // Local State
  const [search, setSearch] = useState("");
  // Note: Pagination logic can be added here if backend supports it for sellers list
  // Currently displaying all fetched sellers filtering client-side or assume paginated response

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  const handleView = (id) => {
    navigate(`/sellers/${id}`);
  };

  // Simple client-side filter for now if API doesn't support search params yet
  const filteredSellers = sellers?.filter(s => 
    s.storeName.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading && sellers.length === 0) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage registered vendors and stores.</p>
        </div>
        <div className="w-full sm:w-64">
           <Input 
             placeholder="Search by store or email..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      {filteredSellers.length > 0 ? (
        <SellerTable sellers={filteredSellers} onView={handleView} />
      ) : (
        !loading && (
          <EmptyState 
            title="No sellers found" 
            description="No active seller accounts match your criteria." 
          />
        )
      )}
    </div>
  );
};

export default SellersList;