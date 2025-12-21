const AuthButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold"
    >
      {text}
    </button>
  );
};

export default AuthButton;
