import { useNavigate } from "react-router-dom";

const OrderDetailHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-purple-700 text-white px-4 py-3 flex items-center gap-3">
      <button onClick={() => navigate(-1)} className="text-xl">
        ←
      </button>
      <h1 className="text-lg font-semibold">Order Details</h1>
    </header>
  );
};

export default OrderDetailHeader;
