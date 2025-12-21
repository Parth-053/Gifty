const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
