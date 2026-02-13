import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Briefcase, Home, Loader2 } from 'lucide-react';
import { addAddress, updateAddress } from '../../store/addressSlice';
import toast from 'react-hot-toast';

const ManageAddress = () => {
  const { id } = useParams(); 
  const isEditMode = Boolean(id);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: addresses, loading } = useSelector((state) => state.addresses || { items: [] });
  const existingAddress = addresses.find(addr => addr._id === id);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    state: '',
    city: '',
    addressLine1: '', 
    addressLine2: '', 
    type: 'Home',     
    isDefault: false
  });

  useEffect(() => {
    if (isEditMode && existingAddress) {
      setFormData({
        fullName: existingAddress.fullName || '',
        phone: existingAddress.phone || '',
        pincode: existingAddress.pincode || '',
        state: existingAddress.state || '',
        city: existingAddress.city || '',
        addressLine1: existingAddress.addressLine1 || '',
        addressLine2: existingAddress.addressLine2 || '',
        type: existingAddress.type || 'Home',
        isDefault: existingAddress.isDefault || false
      });
    }
  }, [isEditMode, existingAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.addressLine1) {
      toast.error("Please fill all required fields");
      setSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateAddress({ id, data: formData })).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await dispatch(addAddress(formData)).unwrap();
        toast.success("Address added successfully!");
      }
      navigate('/user/addresses');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- THEMED HEADER --- */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md px-4 h-16 flex items-center justify-between text-white">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
          {isEditMode ? 'Edit Address' : 'New Address'}
        </h1>

        <div className="w-8" />
      </div>

      {/* --- FORM CONTENT --- */}
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Row 1: Contact Info */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Full Name *</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Row 2: Pincode & State */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Pincode *</label>
              <input 
                type="text" 
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 380015"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">State *</label>
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-gray-700">City *</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Row 3: Address Lines */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Flat, House no., Building *</label>
            <input 
              type="text" 
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Area, Colony, Street</label>
            <input 
              type="text" 
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-purple-500 rounded-xl font-medium transition-all outline-none"
            />
          </div>

          {/* Row 4: Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Address Type</label>
            <div className="flex gap-3">
              {['Home', 'Work', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    formData.type === type 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'Home' && <Home size={16} />}
                  {type === 'Work' && <Briefcase size={16} />}
                  {type === 'Other' && <MapPin size={16} />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Default Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input 
              type="checkbox" 
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
            />
            <label htmlFor="isDefault" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
              Make this my default address
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting || loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-gray-200"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isEditMode ? 'Update Address' : 'Save Address'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ManageAddress;