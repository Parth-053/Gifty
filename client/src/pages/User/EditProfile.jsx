import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Fix: Connect with Auth Context
import { useAuth } from '../../hooks/useAuth';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth(); // Get real user data
  
  // Initialize form with User Data (or dummy fallback)
  const [formData, setFormData] = useState({
    name: user?.name || "Arjun Sharma",
    email: user?.email || "arjun@example.com",
    phone: user?.phone || "9876543210"
  });

  // Sync state if user data loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // ✅ Fix: Update Global Context
    if (updateProfile) {
        updateProfile(formData);
    }
    // In real app, API call goes here
    alert("Profile Updated Successfully!");
    navigate(-1);
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <div className="p-4 shadow-sm flex items-center gap-3 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Edit Profile</h1>
      </div>

      <div className="p-6">
        
        {/* Avatar Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-gray-100 overflow-hidden">
               <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-1 right-1 bg-[#FF6B6B] text-white p-2 rounded-full shadow-md active:scale-95 transition-transform">
               <Camera size={18} />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
            <input 
              type="text" name="name"
              value={formData.name} onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#FF6B6B] outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input 
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#FF6B6B] outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
            <input 
              type="tel" name="phone"
              value={formData.phone} onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[#FF6B6B] outline-none font-medium"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full mt-10 bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Save size={18} /> Save Changes
        </button>

      </div>
    </div>
  );
};

export default EditProfile;