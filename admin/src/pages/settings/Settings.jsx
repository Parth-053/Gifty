import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettings } from "../../store/settingsSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Settings = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.settings);
  
  // Safe defaults ensuring no field is undefined
  const [form, setForm] = useState({ 
    sellerCommission: 0, 
    buyerPlatformFee: 0, 
    taxRate: 0, 
    minPayoutAmount: 500 
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setForm({ 
        sellerCommission: data.sellerCommission || 0,
        buyerPlatformFee: data.buyerPlatformFee || 0,
        taxRate: data.taxRate || 0,
        minPayoutAmount: data.minPayoutAmount || 500
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Revenue Settings</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Seller Revenue */}
          <div className="p-4 bg-blue-50 rounded border border-blue-100">
            <h3 className="text-blue-900 font-semibold mb-3">Seller Charges</h3>
            <Input 
              label="Commission Rate (%)" 
              type="number" 
              value={form.sellerCommission} 
              onChange={(e) => setForm({...form, sellerCommission: Number(e.target.value)})} 
              min="0"
              step="0.1"
              description="Percentage deducted from Seller's product price."
            />
          </div>

          {/* Section 2: Buyer Revenue */}
          <div className="p-4 bg-green-50 rounded border border-green-100">
            <h3 className="text-green-900 font-semibold mb-3">Buyer Charges</h3>
            <Input 
              label="Platform Fee (Fixed ₹)" 
              type="number" 
              value={form.buyerPlatformFee} 
              onChange={(e) => setForm({...form, buyerPlatformFee: Number(e.target.value)})} 
              min="0"
              step="1"
              description="Fixed amount added to the Customer's bill."
            />
          </div>

          {/* Section 3: General */}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Global Tax Rate (%)" 
              type="number" 
              value={form.taxRate} 
              onChange={(e) => setForm({...form, taxRate: Number(e.target.value)})} 
            />
            <Input 
              label="Min Payout Amount (₹)" 
              type="number" 
              value={form.minPayoutAmount} 
              onChange={(e) => setForm({...form, minPayoutAmount: Number(e.target.value)})} 
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" isLoading={loading}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;