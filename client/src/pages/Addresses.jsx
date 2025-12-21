import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import AddressHeader from "../components/AddressHeader";
import AddressCard from "../components/AddressCard";
import AddAddressButton from "../components/AddAddressButton";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      const res = await fetch(`${API_URL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAddresses(data);
    };

    fetchAddresses();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-24">
      <AddressHeader />

      <div className="px-4 mt-4 space-y-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr._id}
            address={addr}
            defaultAddress={addr.isDefault}
          />
        ))}
      </div>

      <AddAddressButton />
    </div>
  );
};

export default Addresses;
