import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { syncSellerProfile } from "../../store/authSlice";  
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Onboarding = () => {
  const { seller } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      storeName: seller?.storeName || "",
      phone: seller?.phone || "",
      gstin: seller?.gstin || "",
      address: {
        street: seller?.address?.street || "",
        city: seller?.address?.city || "",
        state: seller?.address?.state || "",
        pincode: seller?.address?.pincode || "",
      },
      bankDetails: {
        accountHolderName: seller?.bankDetails?.accountHolderName || "",
        accountNumber: seller?.bankDetails?.accountNumber || "",
        ifscCode: seller?.bankDetails?.ifscCode || "",
        bankName: seller?.bankDetails?.bankName || "",
      }
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Update Profile API Call
      await api.put("/seller/profile", data);
      
      // 2. Refresh Local State
      await dispatch(syncSellerProfile()).unwrap();
      
      toast.success("Profile completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Store Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Just a few more details to start selling on Gifty.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Business Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Business Details</h3>
                <Input 
                  label="Store Name" 
                  {...register("storeName", { required: "Store name is required" })}
                  error={errors.storeName?.message}
                />
                <Input 
                  label="GSTIN (Tax ID)" 
                  placeholder="22AAAAA0000A1Z5"
                  {...register("gstin", { required: "GSTIN is required" })}
                  error={errors.gstin?.message}
                />
                <Input 
                  label="Phone Number" 
                  {...register("phone", { required: "Phone is required" })}
                  error={errors.phone?.message}
                />
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setStep(2)}>Next: Address</Button>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pickup Address</h3>
                <Input 
                  label="Street Address" 
                  {...register("address.street", { required: "Street is required" })}
                  error={errors.address?.street?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="City" 
                    {...register("address.city", { required: "City is required" })}
                    error={errors.address?.city?.message}
                  />
                  <Input 
                    label="State" 
                    {...register("address.state", { required: "State is required" })}
                    error={errors.address?.state?.message}
                  />
                </div>
                <Input 
                  label="Pincode" 
                  {...register("address.pincode", { 
                    required: "Pincode is required",
                    pattern: { value: /^[0-9]{6}$/, message: "Invalid Pincode" }
                  })}
                  error={errors.address?.pincode?.message}
                />
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)}>Next: Bank Info</Button>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Bank Details (For Payouts)</h3>
                <Input 
                  label="Account Holder Name" 
                  {...register("bankDetails.accountHolderName", { required: "Required" })}
                  error={errors.bankDetails?.accountHolderName?.message}
                />
                <Input 
                  label="Account Number" 
                  type="password"
                  {...register("bankDetails.accountNumber", { required: "Required" })}
                  error={errors.bankDetails?.accountNumber?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="IFSC Code" 
                    {...register("bankDetails.ifscCode", { required: "Required" })}
                    error={errors.bankDetails?.ifscCode?.message}
                  />
                  <Input 
                    label="Bank Name" 
                    {...register("bankDetails.bankName", { required: "Required" })}
                    error={errors.bankDetails?.bankName?.message}
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" isLoading={loading}>Complete Setup</Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;