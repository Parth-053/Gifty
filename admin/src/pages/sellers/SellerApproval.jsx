import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingSellers, updateSellerStatus } from "../../store/sellerSlice";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const SellerApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Note: Ensure your sellerSlice has 'pendingList' populated by fetchPendingSellers
  const { pendingList, loading } = useSelector((state) => state.sellers);

  useEffect(() => {
    dispatch(fetchPendingSellers());
  }, [dispatch]);

  const handleAction = async (id, status) => {
    try {
      await dispatch(updateSellerStatus({ id, status, reason: "Admin Action" })).unwrap();
      toast.success(`Seller ${status} successfully`);
    } catch  {
      toast.error("Action failed");
    }
  };

  if (loading && pendingList.length === 0) return <Loader />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Seller Approvals</h1>
        <p className="text-gray-500">Review and verify new seller accounts.</p>
      </div>

      {pendingList.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <FiCheck className="mx-auto text-4xl text-green-500 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
          <p className="text-gray-500">No pending seller requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Store Details</th>
                <th className="px-6 py-4 font-semibold text-gray-600">GST / Docs</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingList.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{seller.storeName}</p>
                      <p className="text-sm text-gray-500">Owner: {seller.name}</p>
                      <button 
                        onClick={() => navigate(`/sellers/${seller._id}`)}
                        className="text-xs text-blue-600 hover:underline mt-1"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {seller.gstNumber ? (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                        {seller.gstNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FiAlertCircle /> Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{seller.email}</p>
                    <p>{seller.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(seller._id, "approved")}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                        title="Approve"
                      >
                        <FiCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(seller._id, "rejected")}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <FiX size={18} />
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