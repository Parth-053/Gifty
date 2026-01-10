import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import Toast from '../../components/common/Toast';

const SellerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'seller@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dummy Update
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal information and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Avatar Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer">
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-gray-50" 
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="text-white" size={24} />
              </div>
            </div>
            <h3 className="font-bold text-gray-800">{profile.fullName}</h3>
            <p className="text-xs text-gray-500">Seller ID: #SL-8821</p>
          </div>
        </div>

        {/* Right: Details Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Personal Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
                     <User size={18} className="text-gray-400" />
                     <input 
                       type="text" 
                       name="fullName"
                       value={profile.fullName} 
                       onChange={handleChange}
                       className="bg-transparent outline-none w-full text-sm font-medium" 
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
                     <Phone size={18} className="text-gray-400" />
                     <input 
                       type="text" 
                       name="phone"
                       value={profile.phone} 
                       onChange={handleChange}
                       className="bg-transparent outline-none w-full text-sm font-medium" 
                     />
                  </div>
               </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
               <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all opacity-70">
                  <Mail size={18} className="text-gray-400" />
                  <input 
                    type="email" 
                    value={profile.email} 
                    disabled
                    className="bg-transparent outline-none w-full text-sm font-medium cursor-not-allowed text-gray-500" 
                  />
               </div>
               <p className="text-[10px] text-gray-400 mt-1 ml-1">Email cannot be changed directly. Contact support.</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <h3 className="font-bold text-gray-800 mb-4">Change Password</h3>
               <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all mb-4">
                  <Lock size={18} className="text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="New Password (leave empty to keep current)" 
                    className="bg-transparent outline-none w-full text-sm font-medium" 
                  />
               </div>
            </div>

            <div className="flex justify-end pt-2">
               <button 
                 type="submit" 
                 disabled={loading}
                 className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors disabled:opacity-70"
               >
                  {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
               </button>
            </div>

          </form>
        </div>

      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SellerProfile;