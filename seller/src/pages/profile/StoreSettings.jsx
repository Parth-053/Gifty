import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updateStoreSettings, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { BuildingStorefrontIcon, MapPinIcon } from "@heroicons/react/24/outline";

const StoreSettings = () => {
  const dispatch = useDispatch();
  const { profile, actionLoading, successMessage, error } = useSelector((state) => state.seller);

  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    // If profile not loaded, fetch it (or rely on parent layout fetch)
    if (!profile) dispatch(fetchSellerProfile());
    return () => { dispatch(clearSellerMessages()); };
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        storeName: profile.storeName || "",
        storeDescription: profile.storeDescription || "",
        address: profile.storeAddress?.address || "",
        city: profile.storeAddress?.city || "",
        state: profile.storeAddress?.state || "",
        pincode: profile.storeAddress?.pincode || ""
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        storeName: form.storeName,
        storeDescription: form.storeDescription,
        storeAddress: {
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode
        }
    };
    dispatch(updateStoreSettings(payload));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        
        {(successMessage || error) && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {error || successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="border-b border-gray-100 pb-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Info</h3>
            <Input 
                label="Store Name" 
                value={form.storeName} 
                onChange={(e) => setForm({ ...form, storeName: e.target.value })} 
                icon={BuildingStorefrontIcon}
                required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
              <textarea 
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={form.storeDescription}
                onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
                placeholder="Tell customers about your shop..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-500" /> Store Address
            </h3>
            
            <Input 
                label="Street Address" 
                value={form.address} 
                onChange={(e) => setForm({ ...form, address: e.target.value })} 
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                    label="City" 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                    required
                />
                <Input 
                    label="State" 
                    value={form.state} 
                    onChange={(e) => setForm({ ...form, state: e.target.value })} 
                    required
                />
                <Input 
                    label="Pincode" 
                    value={form.pincode} 
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })} 
                    required
                />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={actionLoading}>
              Update Store
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreSettings;