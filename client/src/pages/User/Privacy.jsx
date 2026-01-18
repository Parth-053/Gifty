import React from 'react';
import { ArrowLeft, Key, Shield, ChevronRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Privacy & Security</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Key size={18} /></div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-800">Change Password</h3>
                    <p className="text-[10px] text-gray-400">Last changed 3 months ago</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
           </div>

           <div className="p-4 flex items-center justify-between active:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="bg-green-50 text-green-600 p-2 rounded-lg"><Shield size={18} /></div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-800">Two-Factor Auth</h3>
                    <p className="text-[10px] text-green-600 font-bold">Enabled</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
           </div>
        </div>

        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Recent Login Activity</h3>
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                 <div className="bg-gray-100 p-2 rounded-lg"><Smartphone size={20} className="text-gray-600" /></div>
                 <div>
                    <h4 className="text-sm font-bold text-gray-800">iPhone 13 Pro</h4>
                    <p className="text-xs text-gray-500">Mumbai, India • Active Now</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-4 text-center">
           <p className="text-xs text-gray-400">
             Read our <span className="text-blue-500 underline">Privacy Policy</span> and <span className="text-blue-500 underline">Terms of Service</span>.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;