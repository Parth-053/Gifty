import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCoupons, deleteCoupon } from "../../store/couponSlice";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
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

  if (loading && coupons.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Button onClick={() => navigate("/coupons/add")}><PlusIcon className="h-5 w-5 mr-2" /> Create Coupon</Button>
      </div>

      {coupons.length > 0 ? (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-indigo-600">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{coupon.discountValue}% Off</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No coupons" description="Create a discount code to boost sales." />
      )}
    </div>
  );
};

export default CouponsList;