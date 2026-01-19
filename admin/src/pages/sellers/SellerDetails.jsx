import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSellerStatus } from "../../store/sellerSlice";
import api from "../../api/axios";
import { FiArrowLeft, FiCheck, FiX, FiShield, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load single seller data
  useEffect(() => {
    api.get(`/admin/sellers/${id}`)
       .then(res => setSeller(res.data.data))
       .catch(() => toast.error("Failed to load seller"))
       .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (status) => {
    try {
      await dispatch(updateSellerStatus({ id, status, reason: "Admin Detailed Review" })).unwrap();
      toast.success(`Seller ${status} successfully`);
      navigate("/sellers"); // Go back to list
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader />;
  if (!seller) return <div>Seller not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black">
        <FiArrowLeft /> Back
      </button>

      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{seller.storeName}</h1>
          <p className="text-gray-500 mt-1">Owner: {seller.name}</p>
          <div className="mt-3">
             <span className={`px-3 py-1 rounded text-sm font-bold ${
               seller.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
             }`}>
               Status: {seller.isVerified ? "Verified" : "Pending / Unverified"}
             </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={() => handleAction("approved")} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <FiCheck /> Approve Store
          </button>
          <button onClick={() => handleAction("rejected")} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <FiX /> Reject Store
          </button>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiBriefcase /> Business Details
          </h3>
          <div className="space-y-3">
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Phone:</strong> {seller.phone}</p>
            <p><strong>GST Number:</strong> {seller.gstNumber || "N/A"}</p>
            <p><strong>Description:</strong> {seller.storeDescription || "No description provided."}</p>
          </div>
        </div>

        {/* Bank & Security */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiShield /> Bank & Legal
          </h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
             {/* Mock Bank Data if not in DB yet */}
            <p><strong>Bank Name:</strong> {seller.bankDetails?.bankName || "Pending"}</p>
            <p><strong>Account No:</strong> {seller.bankDetails?.accountNumber || "Pending"}</p>
            <p><strong>IFSC Code:</strong> {seller.bankDetails?.ifscCode || "Pending"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;