const DeliveryAddressSummary = ({ address }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-semibold mb-2">
        Delivery Address
      </h2>

      <p className="text-sm font-medium">{address.name}</p>
      <p className="text-sm text-gray-600">
        {address.street}, {address.city}, {address.state} -{" "}
        {address.pincode}
      </p>
      <p className="text-sm text-gray-600">
        Phone: {address.phone}
      </p>
    </div>
  );
};

export default DeliveryAddressSummary;
