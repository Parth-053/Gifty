const AddressCard = ({ address, defaultAddress }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm border ${
        defaultAddress ? "border-purple-600" : ""
      }`}
    >
      {defaultAddress && (
        <span className="text-xs text-purple-700 font-semibold">
          DEFAULT
        </span>
      )}

      <p className="mt-1 font-semibold text-sm">
        {address.name}
      </p>

      <p className="text-sm text-gray-600">
        {address.street}, {address.city}, {address.state} –{" "}
        {address.pincode}
      </p>

      <p className="text-sm text-gray-600">
        Phone: {address.phone}
      </p>
    </div>
  );
};

export default AddressCard;
