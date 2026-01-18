import React from 'react';
import { MapPin, Bell, ShieldCheck, HelpCircle, LogOut, Settings, CreditCard } from 'lucide-react';

// Components
import ProfileHeader from '../../components/account/ProfileHeader';
import StatsBar from '../../components/account/StatsBar';
import MenuLink from '../../components/account/MenuLink';

const Account = () => {
  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-28">
      
      {/* 1. Profile Section */}
      <ProfileHeader />

      {/* 2. Stats Bar (Connects to Cart/Wishlist Hooks internally) */}
      <StatsBar />

      {/* 3. Menu Groups */}
      
      {/* Group: Shopping */}
      <div className="mx-4 mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <MenuLink icon={MapPin} label="Saved Addresses" subLabel="Home, Office" to="/account/addresses" />
        <MenuLink icon={CreditCard} label="Payment Methods" subLabel="Cards, UPI" to="/account/payments" />
        <MenuLink icon={Bell} label="Notifications" to="/account/notifications" />
      </div>

      {/* Group: Support & Settings */}
      <div className="mx-4 mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <MenuLink icon={Settings} label="Account Settings" to="/account/settings" />
        <MenuLink icon={ShieldCheck} label="Privacy & Security" to="/account/privacy" />
        <MenuLink icon={HelpCircle} label="Help & Support" to="/account/help" />
      </div>

      {/* Group: Logout */}
      <div className="mx-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <MenuLink icon={LogOut} label="Log Out" isDestructive={true} />
      </div>

      {/* Version Info */}
      <div className="text-center mt-6 mb-4">
        <p className="text-[10px] text-gray-400 font-medium tracking-widest">GIFTY APP V1.0.0</p>
      </div>

    </div>
  );
};

export default Account;