import React from 'react';
import { Edit2, Camera } from 'lucide-react';

const ProfileHeader = () => {
  return (
    <div className="bg-white p-6 pb-8 flex flex-col items-center border-b border-gray-50 relative">
      
      {/* Profile Image with Edit Badge */}
      <div className="relative mb-3 group cursor-pointer">
        <div className="w-24 h-24 rounded-full p-1 border-2 border-[#FF6B6B] border-dashed">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="absolute bottom-1 right-1 bg-[#FF6B6B] text-white p-1.5 rounded-full shadow-md">
          <Camera size={14} />
        </div>
      </div>

      {/* Info */}
      <h2 className="text-xl font-bold text-gray-800">Ananya Sharma</h2>
      <p className="text-sm text-gray-500 font-medium">+91 98765 43210</p>
      
      {/* Edit Profile Button */}
      <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#FF6B6B] transition-colors">
        <Edit2 size={20} />
      </button>

    </div>
  );
};

export default ProfileHeader;