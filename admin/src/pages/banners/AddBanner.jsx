import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createBanner } from '../../store/bannerSlice';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    type: 'Main Slider',
    isActive: true,
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.image) return toast.error("Please upload a banner image");
    if (!formData.title) return toast.error("Title is required");

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    data.append("type", formData.type);
    data.append("isActive", formData.isActive);
    data.append("image", formData.image); 

    try {
      await dispatch(createBanner(data)).unwrap();
      toast.success("Banner published successfully!");
      navigate('/banners');
    } catch (error) {
      toast.error(error || "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Banner</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Image Upload Area */}
        <div className="space-y-2">
           <label className="block text-sm font-bold text-gray-700">Banner Image</label>
           <div className={`h-52 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden relative transition-colors ${imagePreview ? 'border-blue-500 bg-gray-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}>
              
              {imagePreview ? (
                 <>
                   <img src={imagePreview} className="w-full h-full object-contain" alt="Preview" />
                   <button 
                    onClick={() => { setImagePreview(null); setFormData({...formData, image: null}); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                   >
                     <X size={16} />
                   </button>
                 </>
              ) : (
                 <div className="text-center text-gray-400 pointer-events-none">
                    <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                      <Upload size={24} className="text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Click to upload banner</p>
                    <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x400px</p>
                 </div>
              )}
              
              {!imagePreview && (
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  onChange={handleImageChange} 
                />
              )}
           </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
                placeholder="e.g. Summer Sale" 
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Target Link (Optional)</label>
              <input 
                type="text" 
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
                placeholder="/products/category-name" 
              />
           </div>
        </div>

        <div className="flex gap-4">
           <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Position Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                 <option value="Main Slider">Main Slider (Home)</option>
                 <option value="Sidebar Ad">Sidebar Ad</option>
                 <option value="Footer Banner">Footer Banner</option>
              </select>
           </div>
           <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select 
                value={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                 <option value="true">Active</option>
                 <option value="false">Inactive</option>
              </select>
           </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
             <span>Publishing...</span> 
          ) : (
             <> <Save size={20} /> Publish Banner </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddBanner;