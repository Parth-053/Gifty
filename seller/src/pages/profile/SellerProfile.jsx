import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updatePersonalInfo, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { UserIcon, PhoneIcon, CameraIcon } from "@heroicons/react/24/outline";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, actionLoading, successMessage, error } = useSelector((state) => state.seller);

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProfile());
    return () => { dispatch(clearSellerMessages()); };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
      });
      setPreview(profile.avatar);
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("phone", form.phone);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updatePersonalInfo(formData));
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        
        {/* Messages */}
        {(successMessage || error) && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {error || successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-24 w-24">
              <img 
                src={preview || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="h-full w-full rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-md">
                <CameraIcon className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-xs text-gray-500">Allowed *.jpeg, *.jpg, *.png, max 2MB</p>
          </div>

          {/* Fields */}
          <Input 
            label="Full Name" 
            value={form.fullName} 
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
            icon={UserIcon}
            required
          />

          <Input 
            label="Phone Number" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            icon={PhoneIcon}
            required
          />

          {/* Email (Read Only) */}
          <div className="opacity-70">
            <Input 
              label="Email Address" 
              value={profile?.email || ""} 
              disabled={true} 
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={actionLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProfile;