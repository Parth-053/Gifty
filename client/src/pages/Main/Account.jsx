import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, MapPin, CreditCard, Bell, Shield, HelpCircle, LogOut, Ticket } from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import ProfileHeader from '../../components/account/ProfileHeader';
import StatsBar from '../../components/account/StatsBar';
import MenuLink from '../../components/account/MenuLink';

const Account = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logoutUser());
    }
  };

  if (!user) return null; // Or a loader

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <ProfileHeader />
      <StatsBar />

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3 px-1">My Shopping</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <MenuLink to="/user/orders" icon={Package} label="My Orders" />
            <MenuLink to="/user/wishlist" icon={Ticket} label="My Wishlist" />
            <MenuLink to="/user/addresses" icon={MapPin} label="Saved Addresses" />
            <MenuLink to="/user/payment" icon={CreditCard} label="Payment Methods" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-3 px-1">Settings</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <MenuLink to="/user/notifications" icon={Bell} label="Notifications" />
            <MenuLink to="/user/privacy" icon={Shield} label="Privacy & Security" />
            <MenuLink to="/support" icon={HelpCircle} label="Help Center" />
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Account;