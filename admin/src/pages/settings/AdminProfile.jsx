import React, { useState } from 'react';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Profile updated!' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
         <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
         <p className="text-sm text-gray-500">Manage your account settings and password.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Profile Card */}
         <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
               <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                  <img 
                     src="https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff" 
                     alt="Admin" 
                     className="w-full h-full rounded-full border-4 border-gray-50"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                     <Camera size={20} />
                  </div>
               </div>
               <h3 className="font-bold text-gray-900">Super Admin</h3>
               <p className="text-xs text-gray-500">admin@example.com</p>
               <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Active
               </span>
            </div>
         </div>

         {/* Edit Form */}
         <div className="md:col-span-2">
            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
               <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Details</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" value="Super" icon={User} onChange={()=>{}} />
                  <Input label="Last Name" value="Admin" icon={User} onChange={()=>{}} />
               </div>
               <Input label="Email Address" value="admin@example.com" icon={Mail} disabled={true} />

               <div className="pt-4">
                  <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Security</h3>
                  <div className="space-y-4">
                     <Input label="Current Password" type="password" placeholder="•••••••" icon={Lock} onChange={()=>{}} />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="New Password" type="password" placeholder="New strong password" icon={Lock} onChange={()=>{}} />
                        <Input label="Confirm Password" type="password" placeholder="Confirm new password" icon={Lock} onChange={()=>{}} />
                     </div>
                  </div>
               </div>

               <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={loading} icon={Save}>Update Profile</Button>
               </div>
            </form>
         </div>

      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProfile;