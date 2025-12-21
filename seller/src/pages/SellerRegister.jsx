import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthFooterLink from "../components/AuthFooterLink";

const SellerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    storeName: "",
    businessCategory: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/seller/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/verify-otp", {
        state: { email: form.email },
      });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow"
      >
        <AuthHeader
          title="Create Seller Account"
          subtitle="Start selling on Gifty"
        />

        <AuthInput
          placeholder="Seller Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <AuthInput
          placeholder="Store Name"
          onChange={(e) =>
            setForm({ ...form, storeName: e.target.value })
          }
        />

        <AuthInput
          placeholder="Business Category (e.g. Gifts, Flowers)"
          onChange={(e) =>
            setForm({ ...form, businessCategory: e.target.value })
          }
        />

        <AuthInput
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <AuthInput
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <AuthInput
          placeholder="Phone (optional)"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <AuthButton
          text="Create Seller Account"
          type="submit"
        />

        <AuthFooterLink
          text="Already a seller?"
          linkText="Login"
          to="/login"
        />
      </form>
    </div>
  );
};

export default SellerRegister;
