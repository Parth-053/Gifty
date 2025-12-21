import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

const SellerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      /* 🔐 ROLE VALIDATION */
      if (data.user.role !== "seller") {
        throw new Error("This is not a seller account");
      }

      /* ✅ SAVE TOKEN */
      localStorage.setItem("token", data.token);

      /* ✅ REDIRECT */
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow">
        <AuthHeader
          title="Seller Login"
          subtitle="Manage your store on Gifty"
        />

        <AuthInput
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton
          text={loading ? "Logging in..." : "Login"}
          onClick={login}
          disabled={loading}
        />

        <AuthFooterLink
          text="New seller?"
          linkText="Create account"
          to="/register"
        />
      </div>
    </div>
  );
};

export default SellerLogin;
