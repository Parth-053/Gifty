import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, clearError } from "../../store/authSlice";
import { validatePassword, validatePhone } from "../../utils/validateForm";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { UserIcon, BuildingStorefrontIcon, PhoneIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, seller } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "", storeName: "", email: "", phone: "", gstin: "", password: "",
  });

  // Success -> Redirect to Dashboard or Onboarding
  useEffect(() => {
    if (isAuthenticated && seller) {
      if (seller.onboardingCompleted) navigate("/dashboard");
      else navigate("/onboarding");
    }
  }, [isAuthenticated, seller, navigate]);

  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) return alert("Invalid Phone");
    if (!validatePassword(form.password)) return alert("Weak Password");

    dispatch(registerSeller(form));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Partner with Gifty</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Owner Name" name="fullName" icon={UserIcon} value={form.fullName} onChange={handleChange} required />
            <Input label="Store Name" name="storeName" icon={BuildingStorefrontIcon} value={form.storeName} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" icon={EnvelopeIcon} value={form.email} onChange={handleChange} required />
            <Input label="Phone" type="tel" name="phone" icon={PhoneIcon} value={form.phone} onChange={handleChange} required />
            <Input label="GSTIN (Optional)" name="gstin" icon={IdentificationIcon} value={form.gstin} onChange={handleChange} />
            <Input label="Password" type="password" name="password" icon={LockClosedIcon} value={form.password} onChange={handleChange} required />
            <Button type="submit" isLoading={loading}>Create Account</Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/auth/login" className="text-indigo-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;