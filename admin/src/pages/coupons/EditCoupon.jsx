import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCouponDetails, updateCoupon, clearSelectedCoupon } from "../../store/couponSlice";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select"; 
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Helper for date input (YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split('T')[0];
};
 
const CouponForm = ({ initialData, couponId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.coupons);

  // Initialize State DIRECTLY from initialData
  const [form, setForm] = useState({ 
    code: initialData.code || "", 
    description: initialData.description || "", 
    discountType: initialData.discountType || "percentage",  
    discountValue: initialData.discountValue || "", 
    maxDiscountAmount: initialData.maxDiscountAmount || "", 
    minPurchaseAmount: initialData.minPurchaseAmount || 0,
    usageLimit: initialData.usageLimit || 100,
    expirationDate: formatDate(initialData.expirationDate),
    isActive: initialData.isActive ?? true
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if(form.discountType === 'percentage' && Number(form.discountValue) > 100) {
        setError("Percentage discount cannot be more than 100%");
        return;
    }

    const result = await dispatch(updateCoupon({ id: couponId, couponData: form }));
    
    if (updateCoupon.fulfilled.match(result)) {
        navigate("/coupons");
    } else {
        setError(result.payload || "Failed to update coupon");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
              label="Coupon Code" 
              name="code"
              value={form.code} 
              onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.toUpperCase() }})}
              required 
          />
          
          <Select
              label="Discount Type"
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              options={[
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (₹)" }
              ]}
          />
        </div>

        <div>
          <Input 
              label="Description" 
              name="description"
              value={form.description} 
              onChange={handleChange}
              required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
              label="Discount Value" 
              type="number" 
              name="discountValue"
              value={form.discountValue} 
              onChange={handleChange}
              required 
          />
          
          {form.discountType === 'percentage' && (
            <Input 
                label="Max Discount Amount (₹)" 
                type="number" 
                name="maxDiscountAmount"
                value={form.maxDiscountAmount} 
                onChange={handleChange}
                placeholder="Optional"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input 
              label="Min Purchase Amount (₹)" 
              type="number" 
              name="minPurchaseAmount"
              value={form.minPurchaseAmount} 
              onChange={handleChange}
          />
           <Input 
              label="Usage Limit" 
              type="number" 
              name="usageLimit"
              value={form.usageLimit} 
              onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
              label="Expiration Date" 
              type="date" 
              name="expirationDate"
              value={form.expirationDate} 
              onChange={handleChange}
              required 
          />
          
          {/* Active Status Checkbox */}
          <div className="flex items-center h-full pt-6">
              <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Status
              </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={() => navigate("/coupons")} className="mr-3">Cancel</Button>
          <Button type="submit" isLoading={loading}>Update Coupon</Button>
        </div>
      </form>
    </div>
  );
};
 
const EditCoupon = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCoupon, loading } = useSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(fetchCouponDetails(id));
    return () => {
      dispatch(clearSelectedCoupon());
    };
  }, [dispatch, id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/coupons")} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
      </div>

      {/* Only render the form when selectedCoupon is ready */}
      {loading || !selectedCoupon ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      ) : (
        <CouponForm 
          key={selectedCoupon._id} 
          initialData={selectedCoupon} 
          couponId={id} 
        />
      )}
    </div>
  );
};

export default EditCoupon;