import { useEffect, useState } from "react";
import API_URL from "../config/api";

import ProfileHeader from "../components/ProfileHeader";
import ProfileCard from "../components/ProfileCard";

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seller/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/api/seller/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ProfileHeader />

      <ProfileCard
        profile={profile}
        setProfile={setProfile}
        onSave={saveProfile}
        loading={saving}
      />
    </div>
  );
};

export default SellerProfile;
