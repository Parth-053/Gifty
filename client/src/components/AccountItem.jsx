const AccountItem = ({ icon, label, onClick, danger }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
        danger ? "text-red-600" : "text-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>

      <span className="text-gray-400">›</span>
    </div>
  );
};

export default AccountItem;
