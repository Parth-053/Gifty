const ProfileCard = ({ name, email, onEdit }) => {
  return (
    <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <button
        onClick={onEdit}
        className="text-purple-600 text-sm font-medium"
      >
        Edit
      </button>
    </div>
  );
};

export default ProfileCard;
