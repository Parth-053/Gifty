const SaveProfileButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-black text-white py-2 rounded-lg font-medium mt-4 disabled:opacity-60"
    >
      {loading ? "Saving..." : "Save Changes"}
    </button>
  );
};

export default SaveProfileButton;
