import React, { useState } from 'react';
import { ArrowLeft, Bell, Globe, Moon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const [toggles, setToggles] = useState({
    pushNotifs: true,
    emailNotifs: false,
    darkMode: false,
  });

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleDeleteAccount = () => {
    if(window.confirm("Are you sure? This action is irreversible!")) {
      alert("Account deletion request sent.");
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold text-gray-800">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-4 py-3">Notifications</h3>
          <div className="p-4 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-3">
               <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Bell size={18} /></div>
               <span className="text-sm font-semibold text-gray-700">Push Notifications</span>
            </div>
            <button 
              onClick={() => handleToggle('pushNotifs')}
              className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${toggles.pushNotifs ? 'bg-[#FF6B6B]' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${toggles.pushNotifs ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><span className="text-xs font-bold">@</span></div>
               <span className="text-sm font-semibold text-gray-700">Email Updates</span>
            </div>
            <button 
              onClick={() => handleToggle('emailNotifs')}
              className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${toggles.emailNotifs ? 'bg-[#FF6B6B]' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${toggles.emailNotifs ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-4 py-3">App Preferences</h3>
          <div className="p-4 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-3">
               <div className="bg-orange-50 text-orange-600 p-2 rounded-lg"><Globe size={18} /></div>
               <span className="text-sm font-semibold text-gray-700">Language</span>
            </div>
            <span className="text-xs font-bold text-gray-400">English</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-gray-100 text-gray-600 p-2 rounded-lg"><Moon size={18} /></div>
               <span className="text-sm font-semibold text-gray-700">Dark Mode</span>
            </div>
            <button 
              onClick={() => handleToggle('darkMode')}
              className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${toggles.darkMode ? 'bg-black' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${toggles.darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <button 
          onClick={handleDeleteAccount}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
        >
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;