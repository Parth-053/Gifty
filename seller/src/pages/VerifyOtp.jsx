import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../config/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.email,
        otp,
      }),
    });

    if (res.ok) {
      navigate("/login");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">
          Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          className="border p-2 w-full mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          className="bg-black text-white w-full py-2 rounded-lg"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
