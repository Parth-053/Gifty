import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, ShieldCheck, Lock } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
         <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
         <p className="text-sm text-gray-500">View your account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Profile Card */}
         <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
               <div className="relative w-24 h-24 mx-auto mb-4">
                  <img 
                     src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0D8ABC&color=fff`} 
                     alt="Admin" 
                     className="w-full h-full rounded-full border-4 border-gray-50 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
               </div>
               <h3 className="font-bold text-gray-900">{user?.name || "Super Admin"}</h3>
               <p className="text-xs text-gray-500">{user?.email || "admin@gifty.com"}</p>
               
               <div className="mt-4 flex justify-center gap-2">
                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase border border-blue-100">
                    <Shield size={12} /> {user?.role || "Administrator"}
                 </span>
               </div>
            </div>
         </div>

         {/* Read-Only Details */}
         <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-800">Account Information</h3>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    <ShieldCheck size={14} /> Secure Mode
                  </span>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <User className="text-gray-400" size={18} />
                       <span className="text-gray-700 font-medium">{user?.name || "Super Admin"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <Mail className="text-gray-400" size={18} />
                       <span className="text-gray-700 font-medium">{user?.email || "admin@gifty.com"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Role & Access</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <Lock className="text-gray-400" size={18} />
                       <span className="text-gray-700 font-medium">Full Access (Super Admin)</span>
                    </div>
                  </div>
               </div>

               {/* Security Notice */}
               <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
                  <Lock className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <div>
                     <h4 className="text-sm font-bold text-orange-800">Changes Restricted</h4>
                     <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                        For security reasons, profile details and passwords cannot be changed from the dashboard. 
                        To update credentials, please access the <strong>Database Console</strong> or contact the system administrator.
                     </p>
                  </div>
               </div>

            </div>
         </div>

      </div>
    </div>
  );
};

export default AdminProfile;