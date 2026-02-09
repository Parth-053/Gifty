import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../store/couponSlice";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select"; 
import Button from "../../components/common/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.coupons);  

  const [form, setForm] = useState({ 
    code: "", 
    description: "", // Added Field
    discountType: "percentage",  
    discountValue: "", 
    maxDiscountAmount: "", // Added Field
    minPurchaseAmount: 0,
    usageLimit: 100,
    expirationDate: "" 
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic Validation
    if(form.discountType === 'percentage' && Number(form.discountValue) > 100) {
        setError("Percentage discount cannot be more than 100%");
        return;
    }

    const result = await dispatch(createCoupon(form));
    
    if (createCoupon.fulfilled.match(result)) {
        navigate("/coupons");
    } else {
        setError(result.payload || "Failed to create coupon");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/coupons")} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Coupon</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Code & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label="Coupon Code" 
                name="code"
                value={form.code} 
                onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.toUpperCase() }})}
                placeholder="SUMMER50"
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

          {/* Row 2: Description (New) */}
          <div>
            <Input 
                label="Description" 
                name="description"
                value={form.description} 
                onChange={handleChange}
                placeholder="50% off for summer sale"
                required 
            />
          </div>

          {/* Row 3: Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label="Discount Value" 
                type="number" 
                name="discountValue"
                value={form.discountValue} 
                onChange={handleChange}
                placeholder={form.discountType === 'percentage' ? "10" : "500"}
                required 
            />
            
            {/* Conditional Max Discount Amount (Only for Percentage) */}
            {form.discountType === 'percentage' && (
              <Input 
                  label="Max Discount Amount (₹)" 
                  type="number" 
                  name="maxDiscountAmount"
                  value={form.maxDiscountAmount} 
                  onChange={handleChange}
                  placeholder="Optional limit (e.g. 500)"
              />
            )}
          </div>

          {/* Row 4: Date & Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
                label="Min Purchase Amount (₹)" 
                type="number" 
                name="minPurchaseAmount"
                value={form.minPurchaseAmount} 
                onChange={handleChange}
            />
             <Input 
                label="Usage Limit (Total Users)" 
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
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => navigate("/coupons")} className="mr-3">Cancel</Button>
            <Button type="submit" isLoading={loading}>Create Coupon</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;