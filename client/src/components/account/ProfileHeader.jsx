import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Camera, Mail } from 'lucide-react';

const ProfileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm mb-6">
      
      {/* Avatar Section */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-blue-600 overflow-hidden">
          {user?.avatar?.url ? (
            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md">
          <Camera size={14} />
        </button>
      </div>

      {/* Info Section */}
      <div className="text-center sm:text-left flex-1">
        <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mt-1 font-medium">
          <Mail size={16} />
          {user?.email}
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {user?.role === 'seller' ? 'Seller Account' : 'Customer'}
          </span>
          {user?.isEmailVerified && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;