import React, { useState, useEffect } from 'react';
import { Upload, X, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';

const ProductForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics', // Default
    stock: '',
    description: '',
    images: [] // Array of preview URLs
  });

  const [errors, setErrors] = useState({});

  // Load initial data for Edit Mode
  useEffect(() => {
    if (initialData.id) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        category: initialData.category || 'Electronics',
        stock: initialData.stock || '',
        description: initialData.description || '',
        images: initialData.images || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server. 
    // Here we just create local preview URLs.
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Main Info */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* General Info Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">General Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                rows="5"
                value={formData.description} 
                onChange={handleChange}
                placeholder="Product detailed description..."
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Media Upload Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product Images</h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Upload Box */}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <Upload size={24} className="text-gray-400 group-hover:text-blue-500" />
              <span className="text-xs font-bold text-gray-500 mt-2 group-hover:text-blue-600">Upload</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Price & Meta */}
      <div className="space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Pricing & Inventory</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
              <input 
                type="number" 
                name="price"
                value={formData.price} 
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg outline-none font-bold text-gray-800 ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input 
                type="number" 
                name="stock"
                value={formData.stock} 
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg outline-none ${errors.stock ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-white"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Decor</option>
                <option>Books</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Saving..." : <><Save size={18} /> Save Product</>}
          </button>
        </div>

      </div>

    </form>
  );
};

export default ProductForm;