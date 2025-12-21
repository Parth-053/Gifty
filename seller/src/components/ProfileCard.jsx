import ProfileInput from "./ProfileInput";
import SaveProfileButton from "./SaveProfileButton";

const ProfileCard = ({
  profile,
  setProfile,
  onSave,
  loading,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-xl">
      <ProfileInput
        label="Seller Name"
        value={profile.name}
        onChange={(e) =>
          setProfile({
            ...profile,
            name: e.target.value,
          })
        }
      />

      <ProfileInput
        label="Email"
        value={profile.email}
        disabled
      />

      <ProfileInput
        label="Phone"
        value={profile.phone}
        onChange={(e) =>
          setProfile({
            ...profile,
            phone: e.target.value,
          })
        }
      />

      <ProfileInput
        label="Store Name"
        value={profile.storeName}
        placeholder="Your store name"
        onChange={(e) =>
          setProfile({
            ...profile,
            storeName: e.target.value,
          })
        }
      />

      <SaveProfileButton
        onClick={onSave}
        loading={loading}
      />
    </div>
  );
};

export default ProfileCard;
