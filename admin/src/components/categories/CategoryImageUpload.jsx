import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const CategoryImageUpload = ({ image, onChange }) => {
  const [preview, setPreview] = useState(image);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file); // Pass file back to parent
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image</label>
      
      {preview ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 group">
          <img src={preview} alt="Category" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 text-center">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default CategoryImageUpload;