import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReturns, updateReturnStatus } from "../../store/returnSlice";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

const ReturnRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.returns);

  useEffect(() => {
    dispatch(fetchReturns());
  }, [dispatch]);

  const handleAction = (id, status) => {
    dispatch(updateReturnStatus({ id, status }));
  };

  if (loading && requests.length === 0) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Return Requests</h1>
      {requests.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{req.orderId}</td>
                  <td className="px-6 py-4">{req.reason}</td>
                  <td className="px-6 py-4"><Badge variant={req.status === 'approved' ? 'success' : 'warning'}>{req.status}</Badge></td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === 'pending' && (
                        <>
                            <Button size="sm" variant="success" onClick={() => handleAction(req._id, 'approved')}>Approve</Button>
                            <Button size="sm" variant="danger" onClick={() => handleAction(req._id, 'rejected')}>Reject</Button>
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No returns" description="No return requests found." />
      )}
    </div>
  );
};

export default ReturnRequests;