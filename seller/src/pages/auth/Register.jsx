import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, clearError } from "../../store/authSlice";
import { validatePassword, validatePhone, validateGSTIN } from "../../utils/validateForm";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { UserIcon, BuildingStorefrontIcon, PhoneIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, seller } = useSelector((state) => state.auth);

  // Initial Form State
  const [form, setForm] = useState({
    fullName: "",
    storeName: "",
    email: "",
    phone: "",
    gstin: "",
    password: "",
  });

  const [validationErr, setValidationErr] = useState("");

  // Handle successful registration -> redirect to pending
  useEffect(() => {
    if (isAuthenticated && seller) {
      navigate("/auth/pending");
    }
  }, [isAuthenticated, seller, navigate]);

  // Clear errors on mount/unmount
  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErr("");

    // 1. Validate Phone (Indian 10-digit)
    if (!validatePhone(form.phone)) {
      setValidationErr("Please enter a valid 10-digit phone number.");
      return;
    }

    // 2. Validate Password (Min 8 chars, 1 number)
    if (!validatePassword(form.password)) {
      setValidationErr("Password must contain at least 8 characters and 1 number.");
      return;
    }

    // 3. Validate GSTIN (Optional but good check if provided)
    if (form.gstin && !validateGSTIN(form.gstin)) {
        setValidationErr("Invalid GSTIN format.");
        return;
    }

    // Dispatch Register Thunk
    dispatch(registerSeller(form));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Partner with Gifty
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your store and start selling
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          {(error || validationErr) && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
              {validationErr || error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="grid grid-cols-1 gap-4">
                <Input 
                    label="Owner Name" 
                    name="fullName" 
                    icon={UserIcon} 
                    value={form.fullName} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. John Doe" 
                />
            </div>

            {/* Store Details */}
            <Input 
                label="Store Name" 
                name="storeName" 
                icon={BuildingStorefrontIcon} 
                value={form.storeName} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Gifty Gifts" 
            />

            <Input 
                label="GSTIN (Optional)" 
                name="gstin" 
                icon={IdentificationIcon} 
                value={form.gstin} 
                onChange={handleChange} 
                placeholder="22AAAAA0000A1Z5" 
            />
            
            {/* Contact Details */}
            <Input 
                label="Email Address" 
                type="email" 
                name="email" 
                icon={EnvelopeIcon} 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="seller@example.com"
            />
            
            <Input 
                label="Phone Number" 
                type="tel" 
                name="phone" 
                icon={PhoneIcon} 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="9876543210" 
            />
            
            {/* Security */}
            <Input 
                label="Password" 
                type="password" 
                name="password" 
                icon={LockClosedIcon} 
                value={form.password} 
                onChange={handleChange} 
                required 
                placeholder="Strong Password"
            />

            <Button type="submit" isLoading={loading} className="mt-2">
              Create Seller Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;