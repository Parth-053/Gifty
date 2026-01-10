import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Button from '../../components/common/Button';

const AddBanner = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    if (e.target.files[0]) setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Banner</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Image Upload */}
        <div className="space-y-2">
           <label className="block text-sm font-bold text-gray-700">Banner Image</label>
           <div className="h-48 w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative">
              {image ? (
                 <img src={image} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                 <div className="text-center text-gray-400">
                    <Upload size={32} className="mx-auto mb-2" />
                    <p className="text-xs">Click to upload image</p>
                 </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImage} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Summer Sale" />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Link (Optional)</label>
              <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" placeholder="/categories/summer" />
           </div>
        </div>

        <div className="flex gap-4">
           <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Position Type</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white">
                 <option>Main Slider</option>
                 <option>Sidebar Ad</option>
                 <option>Footer Banner</option>
              </select>
           </div>
           <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white">
                 <option>Active</option>
                 <option>Inactive</option>
              </select>
           </div>
        </div>

        <Button className="w-full" icon={Save}>Publish Banner</Button>
      </div>
    </div>
  );
};

export default AddBanner;