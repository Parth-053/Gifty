import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingSellers, verifySeller } from "../../store/sellerSlice";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, FileText } from "lucide-react"; 

const SellerApproval = () => {
  const dispatch = useDispatch();
  
  // Make sure 'sellers' matches the key in store/index.js
  const { pendingSellers, loading } = useSelector((state) => state.sellers);

  useEffect(() => {
    dispatch(fetchPendingSellers());
  }, [dispatch]);

  const handleAction = async (id, status) => {
    const reason = status === 'rejected' ? prompt("Enter rejection reason:") : null;
    if (status === 'rejected' && !reason) return;

    try {
      await dispatch(verifySeller({ id, status, reason })).unwrap();
      toast.success(`Seller ${status} successfully`);
    } catch (err) {
      toast.error(err || "Action failed");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader /></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pending Seller Approvals</h1>
      
      {!pendingSellers || pendingSellers.length === 0 ? (
        <EmptyState message="No pending seller applications found." />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingSellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{seller.storeName}</div>
                    <div className="text-sm text-gray-500">GST: {seller.gstin || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{seller.fullName}</div>
                    <div className="text-sm text-gray-500">{seller.email}</div>
                    <div className="text-sm text-gray-500">{seller.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FileText className="w-3 h-3 mr-1" /> View Docs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleAction(seller._id, "approved")}
                        className="text-green-600 hover:text-green-900 flex items-center"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(seller._id, "rejected")}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerApproval;