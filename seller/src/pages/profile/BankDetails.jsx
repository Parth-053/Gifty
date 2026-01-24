import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updateBankDetails, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { BanknotesIcon, IdentificationIcon } from "@heroicons/react/24/outline";

const BankDetails = () => {
  const dispatch = useDispatch();
  const { profile, actionLoading, successMessage, error } = useSelector((state) => state.seller);

  const [form, setForm] = useState({
    gstin: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: ""
  });

  useEffect(() => {
    if (!profile) dispatch(fetchSellerProfile());
    return () => { dispatch(clearSellerMessages()); };
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        gstin: profile.gstin || "",
        bankName: profile.bankDetails?.bankName || "",
        accountNumber: profile.bankDetails?.accountNumber || "",
        ifscCode: profile.bankDetails?.ifscCode || "",
        accountHolderName: profile.bankDetails?.accountHolderName || ""
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBankDetails(form));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bank & Tax Details</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        
        {(successMessage || error) && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {error || successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <IdentificationIcon className="h-5 w-5 text-gray-500" /> Tax Information
            </h3>
            <Input 
                label="GSTIN" 
                value={form.gstin} 
                onChange={(e) => setForm({ ...form, gstin: e.target.value })} 
                placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-gray-500" /> Bank Account
            </h3>
            
            <Input 
                label="Account Holder Name" 
                value={form.accountHolderName} 
                onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} 
                required
            />

            <Input 
                label="Account Number" 
                type="password" // Masked for security visually
                value={form.accountNumber} 
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} 
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Bank Name" 
                    value={form.bankName} 
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })} 
                    required
                />
                <Input 
                    label="IFSC Code" 
                    value={form.ifscCode} 
                    onChange={(e) => setForm({ ...form, ifscCode: e.target.value })} 
                    required
                    placeholder="SBIN0001234"
                />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={actionLoading}>
              Save Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetails;