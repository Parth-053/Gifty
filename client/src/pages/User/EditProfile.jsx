import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import api from '../../api/axios'; // Direct API call for update or create a thunk

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth(); // checkAuth to refresh user data after update
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: null, // File object
    avatarPreview: user?.avatar?.url || null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      await api.put('/user/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await checkAuth(); // Refresh global auth state
      toast.success("Profile updated successfully!");
      navigate('/user/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {formData.avatarPreview ? (
                <img src={formData.avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-3 bg-gray-900 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
              <Camera size={18} />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-3 font-medium">Tap icon to change photo</p>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <Input 
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your name"
          />
          
          <Input 
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+91 98765 43210"
          />

          <div className="opacity-50 pointer-events-none">
            <Input 
              label="Email Address"
              value={user?.email}
              readOnly
              placeholder="email@example.com"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed</p>
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          fullWidth 
          isLoading={loading}
          icon={Save}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;