import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../config/api";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const res = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.email,
        otp,
      }),
    });

    if (res.ok) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col justify-center px-6">
      <AuthHeader
        title="Verify Email 🔐"
        subtitle={`OTP sent to ${state.email}`}
      />

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mt-6">
        <AuthInput
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <AuthButton text="Verify OTP" onClick={verifyOtp} />
      </div>
    </div>
  );
};

export default VerifyOtp;
