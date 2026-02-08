import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updateStoreProfile, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";

const StoreSettings = () => {
  const dispatch = useDispatch();
  const { profile, loading, success, error } = useSelector((state) => state.seller);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => { dispatch(fetchSellerProfile()); }, [dispatch]);

  // --- FIX: Map Backend fields to Form Inputs ---
  useEffect(() => {
    if (profile) {
      setValue("storeName", profile.storeName || "");
      setValue("storeDescription", profile.storeDescription || "");
      setValue("address", profile.address || "");
      // Note: Phone is usually handled in personal profile, but if you have a separate business phone:
      // setValue("businessPhone", profile.businessPhone || ""); 
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (success) { toast.success(success); dispatch(clearSellerMessages()); }
    if (error) { toast.error(error); dispatch(clearSellerMessages()); }
  }, [success, error, dispatch]);

  const onSubmit = async (data) => {
    // Send as JSON since we aren't uploading files here
    dispatch(updateStoreProfile(data));
  };

  if (loading && !profile) return <div className="flex justify-center p-10"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="Store Name" {...register("storeName", { required: "Store Name is required" })} error={errors.storeName?.message} />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Store Description</label>
          <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            {...register("storeDescription", { required: "Description is required" })} 
          />
        </div>

        <Input label="Business Address" {...register("address", { required: "Address is required" })} error={errors.address?.message} />

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary">Save Store Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;