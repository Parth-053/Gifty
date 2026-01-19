import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingSellers, updateSellerStatus } from "../../store/sellerSlice";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const SellerList = () => {
  const dispatch = useDispatch();
  const { pendingList, loading} = useSelector((state) => state.sellers);

  // 1. Fetch Pending Sellers
  useEffect(() => {
    dispatch(fetchPendingSellers());
  }, [dispatch]);

  // Handle Approval/Rejection
  const handleStatus = async (id, status) => {
    try {
      await dispatch(updateSellerStatus({ id, status, reason: "Admin Verification" })).unwrap();
      toast.success(`Seller ${status} successfully!`);
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading && pendingList.length === 0) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Seller Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600">Store Info</th>
              <th className="px-6 py-4 text-gray-600">Contact</th>
              <th className="px-6 py-4 text-gray-600">GST/Docs</th>
              <th className="px-6 py-4 text-right text-gray-600">Decisions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingList.map((seller) => (
              <tr key={seller._id}>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{seller.storeName}</p>
                  <p className="text-sm text-gray-500">Owner: {seller.name}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <p>{seller.email}</p>
                  <p>{seller.phone}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {seller.gstNumber || "No GST Provided"}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleStatus(seller._id, "approved")}
                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
                  >
                    <FiCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleStatus(seller._id, "rejected")}
                    className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                  >
                    <FiX /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingList.length === 0 && !loading && (
            <div className="p-12 text-center flex flex-col items-center text-gray-500">
                <FiInfo className="text-4xl mb-2 text-gray-300"/>
                <p>No pending seller requests at the moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SellerList;