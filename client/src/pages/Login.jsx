import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col justify-center px-6">
      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Login to continue gifting"
      />

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mt-6">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton text="Login" onClick={handleLogin} />
      </div>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Register"
        to="/register"
      />
    </div>
  );
};

export default Login;
