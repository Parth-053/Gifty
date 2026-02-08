import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updateBankDetails, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-hot-toast";

const BankDetails = () => {
  const dispatch = useDispatch();
  const { profile, actionLoading, success, error } = useSelector((state) => state.seller);

  // --- FIX: Initialize state matches Backend Schema ---
  const [form, setForm] = useState({
    gstin: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: ""
  });

  useEffect(() => {
    if (!profile) dispatch(fetchSellerProfile());
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        gstin: profile.gstin || "",
        // Handle nested bankDetails object
        bankName: profile.bankDetails?.bankName || "",
        accountNumber: profile.bankDetails?.accountNumber || "",
        ifscCode: profile.bankDetails?.ifscCode || "",
        accountHolderName: profile.bankDetails?.accountHolderName || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success) { toast.success(success); dispatch(clearSellerMessages()); }
    if (error) { toast.error(error); dispatch(clearSellerMessages()); }
  }, [success, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Structure payload exactly how backend expects it
    const payload = {
      gstin: form.gstin,
      bankDetails: {
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        accountHolderName: form.accountHolderName
      }
    };
    dispatch(updateBankDetails(payload));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Bank & Tax Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} required />
        
        <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t">Bank Account</h3>
        <Input label="Account Holder Name" value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} required />
        <Input label="Account Number" type="password" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Bank Name" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} required />
            <Input label="IFSC Code" value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value })} required />
        </div>

        <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={actionLoading}>Save Bank Details</Button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;