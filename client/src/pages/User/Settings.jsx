import React from 'react';
import { ArrowLeft, Lock, Bell, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
      </div>

      <div className="space-y-2">
        <SettingItem icon={Bell} title="Push Notifications" type="toggle" />
        <SettingItem icon={Lock} title="Change Password" type="link" />
        <SettingItem icon={Moon} title="Dark Mode" type="toggle" />
      </div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, title, type }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
        <Icon size={20} />
      </div>
      <span className="font-bold text-gray-900">{title}</span>
    </div>
    {type === 'toggle' ? (
      <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
      </div>
    ) : (
      <button className="text-blue-600 text-sm font-bold">Edit</button>
    )}
  </div>
);

export default Settings;