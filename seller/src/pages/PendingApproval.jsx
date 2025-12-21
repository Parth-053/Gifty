import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl text-center space-y-4 max-w-sm">
        <h2 className="text-xl font-bold">
          Account Under Review
        </h2>

        <p className="text-gray-600 text-sm">
          Your seller account is currently under admin review.
          <br />
          You will be able to login once approved.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
