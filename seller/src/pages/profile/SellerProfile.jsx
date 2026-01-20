import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Lock, Save, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile } from '../../store/authSlice'; 

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal information and security.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl border-4 border-white shadow-md">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-all">
                <Camera size={16} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">Seller Account Status: <span className="text-green-600 font-bold capitalize">{user?.status || 'Active'}</span></p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
                <User size={18} className="text-gray-400" />
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-transparent outline-none w-full text-sm font-medium" />
              </div>
            </div>
            {/* Phone, Password fields etc follow same pattern */}
            <button type="submit" disabled={loading} className="md:col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-black transition-all">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Update Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;