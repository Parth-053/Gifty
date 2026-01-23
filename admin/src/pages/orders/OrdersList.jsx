import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../store/orderSlice";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Components
import OrderTable from "../../components/tables/OrderTable";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const OrdersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, totalOrders, loading, error } = useSelector((state) => state.orders);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // placed, processing, etc.
  const limit = 10;

  useEffect(() => {
    // Construct Query Params matching ApiFeatures in backend
    const params = { page, limit, sort: "-createdAt" };
    if (statusFilter) params.orderStatus = statusFilter;

    dispatch(fetchOrders(params));
  }, [dispatch, page, statusFilter]);

  const handleViewOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage customer orders.</p>
        </div>
        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            >
                <option value="">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
            {/* Optional Export Button */}
            <Button variant="outline" size="sm">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      {orders.length > 0 ? (
        <>
          <OrderTable orders={orders} onView={handleViewOrder} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={totalOrders}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        !loading && (
          <EmptyState
            title="No orders found"
            description={statusFilter ? `No orders found with status "${statusFilter}"` : "You haven't received any orders yet."}
          />
        )
      )}
    </div>
  );
};

export default OrdersList;