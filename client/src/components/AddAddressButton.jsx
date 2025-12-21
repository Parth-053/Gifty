import { useNavigate } from "react-router-dom";

const AddAddressButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
      <button
        onClick={() => navigate("/add-address")}
        className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold"
      >
        + Add New Address
      </button>
    </div>
  );
};

export default AddAddressButton;
