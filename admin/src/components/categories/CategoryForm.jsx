import React, { useState, useEffect } from 'react';
import { Upload, X, Save, Image as ImageIcon } from 'lucide-react';

const CategoryForm = ({ initialData, onSubmit, isLoading, categories = [], isEdit = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState('true');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Populate form if Editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setParentId(initialData.parentId || '');
      setIsActive(initialData.isActive ? 'true' : 'false');
      // If image exists from backend
      if (initialData.image?.url) setPreview(initialData.image.url);
    }
  }, [initialData]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (parentId) formData.append('parentId', parentId);
    formData.append('isActive', isActive === 'true');
    if (image) formData.append('image', image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">Category Image</label>
        <div className={`h-40 w-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden relative transition-all ${preview ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
          
          {preview ? (
            <>
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              <button 
                type="button"
                onClick={() => { setPreview(null); setImage(null); }}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400 pointer-events-none">
              <Upload size={24} className="mx-auto mb-1" />
              <span className="text-xs font-medium">Upload Image</span>
            </div>
          )}
          
          {!preview && (
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              onChange={handleImageChange} 
              accept="image/*" 
            />
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g. Electronics"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Parent Category</label>
          <div className="relative">
            <select 
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">None (Top Level)</option>
              {categories
                .filter(c => c._id !== initialData?._id) // Prevent self-parenting
                .map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
        <textarea 
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          placeholder="Short description of the category..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
        <select 
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Action Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <span>Saving...</span>
        ) : (
          <>
            <Save size={20} /> {isEdit ? 'Update Category' : 'Save Category'}
          </>
        )}
      </button>
    </form>
  );
};

export default CategoryForm;