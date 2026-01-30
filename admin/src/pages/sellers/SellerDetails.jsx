import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// FIX: Changed 'updateSellerStatus' to 'verifySeller' to match the slice export
import { fetchSellerDetails, verifySeller, clearCurrentSeller } from "../../store/sellerSlice";
import Loader from "../../components/common/Loader";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "react-hot-toast";

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentSeller: seller, loading, error } = useSelector((state) => state.sellers);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSellerDetails(id));
    return () => {
      dispatch(clearCurrentSeller());
    };
  }, [dispatch, id]);

  const handleStatusUpdate = async (status) => {
    // For rejection or suspension, ask for a reason
    let reason = "";
    if (status === "rejected" || status === "suspended") {
      reason = prompt(`Please enter a reason for marking this seller as ${status}:`);
      if (!reason) return; // Cancel if no reason provided
    }

    if (window.confirm(`Are you sure you want to update status to ${status.toUpperCase()}?`)) {
      setActionLoading(true);
      try {
        // FIX: Using verifySeller action here
        await dispatch(verifySeller({ id, status, reason })).unwrap();
        toast.success(`Seller status updated to ${status}`);
        // Refresh details
        dispatch(fetchSellerDetails(id));
      } catch (err) {
        toast.error(err || "Failed to update status");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!seller) return <div className="text-center p-10">Seller not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to List
        </button>
        <div className="flex space-x-3">
          {seller.status === "pending" && (
            <>
              <button
                disabled={actionLoading}
                onClick={() => handleStatusUpdate("approved")}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Application
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleStatusUpdate("rejected")}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </button>
            </>
          )}
          {seller.status === "approved" && (
            <button
              disabled={actionLoading}
              onClick={() => handleStatusUpdate("suspended")}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Suspend Account
            </button>
          )}
          {seller.status === "suspended" && (
            <button
              disabled={actionLoading}
              onClick={() => handleStatusUpdate("approved")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Re-activate Account
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-500" />
                Store Information
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${seller.status === 'approved' ? 'bg-green-100 text-green-800' : 
                  seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                {seller.status}
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Store Name</p>
                <p className="font-medium text-gray-900 mt-1">{seller.storeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GSTIN</p>
                <p className="font-medium text-gray-900 mt-1">{seller.gstin || "Not Provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="font-medium text-gray-900 mt-1">{seller.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium text-gray-900 mt-1">{new Date(seller.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-indigo-500" />
                Bank Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Account Holder</p>
                <p className="font-medium text-gray-900 mt-1">{seller.bankDetails?.accountHolderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-900 mt-1">{seller.bankDetails?.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium text-gray-900 mt-1">{seller.bankDetails?.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p className="font-medium text-gray-900 mt-1">{seller.bankDetails?.ifscCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Address */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Contact Info</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${seller.email}`} className="text-indigo-600 hover:underline">{seller.email}</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${seller.phone}`} className="text-gray-900 hover:text-indigo-600">{seller.phone}</a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900 mt-1">
                    {seller.address?.street}<br/>
                    {seller.address?.city}, {seller.address?.state}<br/>
                    {seller.address?.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerDetails;