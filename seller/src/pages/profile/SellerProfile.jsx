import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProfile, updatePersonalInfo, clearSellerMessages } from "../../store/sellerSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { UserIcon, PhoneIcon, CameraIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, actionLoading, success, error } = useSelector((state) => state.seller);

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  // --- FIX: Handle nested User object safely ---
  useEffect(() => {
    if (profile) {
      // Some backends put name in 'profile.user.fullName', others in 'profile.fullName'
      // This checks both to be safe
      const name = profile.user?.fullName || profile.fullName || "";
      const phone = profile.phone || ""; // Phone usually stays on seller model
      const userAvatar = profile.user?.avatar || profile.avatar;

      setForm({ fullName: name, phone: phone });
      setPreview(userAvatar);
    }
  }, [profile]);

  useEffect(() => {
    if (success) { toast.success(success); dispatch(clearSellerMessages()); }
    if (error) { toast.error(error); dispatch(clearSellerMessages()); }
  }, [success, error, dispatch]);

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

  if (loading && !profile) return <div className="flex justify-center p-10"><Loader /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Avatar */}
         <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <img src={preview || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full rounded-full object-cover border border-gray-200"/>
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-md">
                <CameraIcon className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} icon={UserIcon} required />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={PhoneIcon} required />
          
          <div className="flex justify-end">
            <Button type="submit" isLoading={actionLoading}>Save Changes</Button>
          </div>
      </form>
    </div>
  );
};

export default SellerProfile;