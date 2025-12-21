const ProfileForm = ({ user, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <div>
        <label className="text-sm text-gray-600">
          Full Name
        </label>
        <input
          type="text"
          value={user.name}
          onChange={(e) =>
            onChange({ ...user, name: e.target.value })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Phone Number
        </label>
        <input
          type="tel"
          value={user.phone || ""}
          onChange={(e) =>
            onChange({ ...user, phone: e.target.value })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProfileForm;
