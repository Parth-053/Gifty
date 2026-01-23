import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../store/couponSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: "", discountValue: "", expiryDate: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(createCoupon(form));
    setLoading(false);
    navigate("/coupons");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Coupon</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Coupon Code" 
            value={form.code} 
            onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
            required 
          />
          <Input 
            label="Discount Percentage (%)" 
            type="number" 
            value={form.discountValue} 
            onChange={(e) => setForm({...form, discountValue: e.target.value})}
            required 
          />
          <Input 
            label="Expiration Date" 
            type="date" 
            value={form.expiryDate} 
            onChange={(e) => setForm({...form, expiryDate: e.target.value})}
            required 
          />
          <Button type="submit" isLoading={loading}>Create Coupon</Button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;