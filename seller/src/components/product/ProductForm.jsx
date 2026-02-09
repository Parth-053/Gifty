import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X, Save, Plus, Tag, Settings, Loader2 } from 'lucide-react';
import { fetchCategories } from '../../store/categorySlice'; 

// Helper function OUTSIDE component (Stable Reference)
const parseData = (data) => ({
  name: data.name || '',
  price: data.price || '',
  discountPrice: data.discountPrice || '',
  // Logic: Use populated object _id OR string ID OR fall back to empty
  categoryId: data.categoryId?._id || data.categoryId || data.category || '', 
  stock: data.stock || '',
  description: data.description || '',
  isCustomizable: data.isCustomizable || false,
  customizationOptions: data.customizationOptions || [],
  tags: data.tags || [],
  images: data.images || []
});

const ProductForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const dispatch = useDispatch();
  
  // --- FIX: Redux Selector Optimization ---
  // 1. Select only the slice. If it's undefined, we handle it later.
  // 2. This prevents the "selector returned a different result" warning.
  const categoryState = useSelector((state) => state.category);
  const categories = categoryState?.categories || [];

  // State Initialization (Lazy to prevent loop)
  const [formData, setFormData] = useState(() => parseData(initialData));
  
  const [customInput, setCustomInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  
  const [previews, setPreviews] = useState(
    initialData.images?.map(img => img.url) || []
  );

  // Fetch Categories on Mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // --- Handlers ---

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const addItem = (e, field, value, setFunc) => {
    e.preventDefault();
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setFunc("");
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if(formData.discountPrice) data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    
    data.append("categoryId", formData.categoryId);
    data.append("isCustomizable", formData.isCustomizable);
    
    formData.customizationOptions.forEach((opt, index) => {
      data.append(`customizationOptions[${index}]`, opt);
    });

    formData.tags.forEach((tag, index) => {
      data.append(`tags[${index}]`, tag);
    });

    formData.images.forEach((file) => {
      if (file instanceof File) {
        data.append("images", file);
      } 
    });

    onSubmit(data);
  };

  const discountPercent = formData.price && formData.discountPrice 
    ? Math.round(((formData.price - formData.discountPrice) / formData.price) * 100) 
    : 0;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
      
      {/* LEFT COLUMN */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Product Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Product Details</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Product Title</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium" 
                placeholder="e.g. Personalized Magic Mirror" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                rows="6" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none" 
                placeholder="Describe your product features..." 
                required 
              />
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Customization</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-600">Is Customizable?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isCustomizable} 
                  onChange={(e) => setFormData({...formData, isCustomizable: e.target.checked})} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {formData.isCustomizable && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm"
                  placeholder="Add option (e.g., Upload Photo, Add Name)"
                  onKeyDown={(e) => e.key === 'Enter' && addItem(e, 'customizationOptions', customInput, setCustomInput)}
                />
                <button 
                  onClick={(e) => addItem(e, 'customizationOptions', customInput, setCustomInput)}
                  type="button"
                  className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.customizationOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                    <Settings size={14} />
                    {opt}
                    <button type="button" onClick={() => removeItem('customizationOptions', idx)} className="hover:text-indigo-900">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Product Media</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previews.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                <img src={img} className="w-full h-full object-cover" alt="preview" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
              <Upload className="text-gray-400 group-hover:text-indigo-500 mb-2" size={24} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Add Photo</span>
              <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        
        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Pricing & Stock</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Original Price (₹)</label>
            <input 
              type="number" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-lg font-black" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Discount Price (₹)</label>
            <div className="relative">
              <input 
                type="number" 
                value={formData.discountPrice} 
                onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-lg font-bold text-green-600" 
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          {/* DYNAMIC CATEGORY DROPDOWN */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
            <select 
              value={formData.categoryId} 
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})} 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Select a Category</option>
              {categories && categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))
              ) : (
                <option value="" disabled>Loading categories...</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Stock Quantity</label>
            <input 
              type="number" 
              value={formData.stock} 
              onChange={(e) => setFormData({...formData, stock: e.target.value})} 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold" 
              required 
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tags</h3>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)} 
              className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 outline-none text-xs" 
              placeholder="Add tag..."
              onKeyDown={(e) => e.key === 'Enter' && addItem(e, 'tags', tagInput, setTagInput)} 
            />
            <button 
              type="button"
              onClick={(e) => addItem(e, 'tags', tagInput, setTagInput)}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                <Tag size={10} />
                {tag}
                <button type="button" onClick={() => removeItem('tags', idx)} className="hover:text-red-500 ml-1">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <><Save size={18} /> Publish Product</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;