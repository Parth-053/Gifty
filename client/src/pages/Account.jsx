import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AccountHeader from "../components/AccountHeader";
import ProfileCard from "../components/ProfileCard";
import AccountSection from "../components/AccountSection";
import BottomNavbar from "../components/BottomNavbar";

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch {
        console.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-24">
      <AccountHeader />

      <ProfileCard
        name={user.name}
        email={user.email}
        onEdit={() => navigate("/edit-profile")}
      />

      <AccountSection
        title="My Orders"
        items={[
          {
            label: "Orders",
            icon: "📦",
            onClick: () => navigate("/orders"),
          },
          {
            label: "Track Order",
            icon: "🚚",
            onClick: () => navigate("/orders"),
          },
        ]}
      />

      <AccountSection
        title="Gifting & Personalization"
        items={[
          {
            label: "Wishlist",
            icon: "❤️",
            onClick: () => navigate("/wishlist"),
          },
          {
            label: "Saved Designs",
            icon: "🎨",
          },
          {
            label: "Gift Addresses",
            icon: "🎁",
            onClick: () => navigate("/addresses"),
          },
        ]}
      />

      <AccountSection
        title="Payments & Addresses"
        items={[
          {
            label: "Saved Addresses",
            icon: "🏠",
            onClick: () => navigate("/addresses"),
          },
          {
            label: "Payment Methods",
            icon: "💳",
          },
        ]}
      />

      <AccountSection
        title="Settings"
        items={[
          {
            label: "Notifications",
            icon: "🔔",
          },
          {
            label: "Help & Support",
            icon: "❓",
          },
          {
            label: "About Gifty",
            icon: "ℹ️",
          },
          {
            label: "Logout",
            icon: "🚪",
            danger: true,
            onClick: () => {
              localStorage.removeItem("token");
              navigate("/login");
            },
          },
        ]}
      />

      <BottomNavbar />
    </div>
  );
};

export default Account;
