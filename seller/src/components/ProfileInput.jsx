const ProfileInput = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-2 focus:ring-black"
        }`}
      />
    </div>
  );
};

export default ProfileInput;
