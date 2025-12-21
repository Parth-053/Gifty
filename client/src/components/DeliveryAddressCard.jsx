import { useNavigate } from "react-router-dom";

const DeliveryAddressCard = ({ address }) => {
  const navigate = useNavigate();

  if (!address) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Delivery Address</h2>
        <button
          onClick={() => navigate("/addresses")}
          className="text-sm text-purple-700"
        >
          Change
        </button>
      </div>

      <p className="text-sm font-medium">{address.name}</p>
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

export default DeliveryAddressCard;
