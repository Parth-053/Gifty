import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col justify-center px-6">
      <AuthHeader
        title="Create Account 🎉"
        subtitle="Start your gifting journey"
      />

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mt-6">
        <AuthInput
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <AuthInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthInput
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <AuthInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <AuthButton text="Create Account" onClick={handleRegister} />
      </div>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Login"
        to="/login"
      />
    </div>
  );
};

export default Register;
