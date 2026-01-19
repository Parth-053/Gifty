import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import Loader from "../../components/common/Loader";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setUser(data.data);
      } catch  {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Loader />;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900">
        <FiArrowLeft /> Back to Users
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${
             user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Contact Info</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <FiMail /> <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiPhone /> <span>{user.phone || "No phone provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiCalendar /> <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Addresses (If any) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Saved Addresses</h3>
          {user.addresses && user.addresses.length > 0 ? (
            <ul className="space-y-3">
              {user.addresses.map((addr, index) => (
                <li key={index} className="flex gap-2 items-start text-sm text-gray-600 border-b pb-2 last:border-0">
                  <FiMapPin className="mt-1 flex-shrink-0" />
                  <span>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No addresses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;