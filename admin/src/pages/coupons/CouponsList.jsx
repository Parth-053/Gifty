import React, { useEffect } from "react";  
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCoupons, deleteCoupon } from "../../store/couponSlice";
import { PlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"; 
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

const CouponsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons, loading } = useSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/coupons/edit/${id}`);
  };

  if (loading && coupons.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">Manage discounts and promotional codes.</p>
        </div>
        <Button onClick={() => navigate("/coupons/add")}>
          <PlusIcon className="h-5 w-5 mr-2" /> 
          Create Coupon
        </Button>
      </div>

      {coupons.length > 0 ? (
        <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {coupon.code}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                      {coupon.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {coupon.discountType === "percentage" 
                      ? `${coupon.discountValue}% Off` 
                      : `₹${coupon.discountValue} Off`
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={coupon.isActive ? "success" : "warning"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Fixed prop name from expiryDate to expirationDate based on Schema */}
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(coupon._id)} 
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon._id)} 
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState 
          title="No coupons found" 
          description="Create a discount code to boost sales and engage customers." 
          action={
            <Button onClick={() => navigate("/coupons/add")}>Create First Coupon</Button>
          }
        />
      )}
    </div>
  );
};

export default CouponsList;