import { useEffect, useState } from "react";
import API_URL from "../config/api";

import EditProfileHeader from "../components/EditProfileHeader";
import ProfileAvatarCard from "../components/ProfileAvatarCard";
import ProfileForm from "../components/ProfileForm";
import SaveProfileBar from "../components/SaveProfileBar";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };
    fetchProfile();
  }, [token]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      <EditProfileHeader />

      <div className="px-4 mt-4 space-y-4">
        <ProfileAvatarCard user={user} />
        <ProfileForm user={user} />
      </div>

      <SaveProfileBar />
    </div>
  );
};

export default EditProfile;
