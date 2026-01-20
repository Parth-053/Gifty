import React, { useState, useEffect } from 'react';
import { Upload, X, Save, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const ProductForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '', price: '', category: PRODUCT_CATEGORIES[0], stock: '', description: '', images: []
  });
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (initialData._id) {
      setFormData({
        name: initialData.name, price: initialData.price,
        category: initialData.category, stock: initialData.stock,
        description: initialData.description, images: initialData.images || []
      });
      setPreviews(initialData.images || []);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    // Generate previews for UI
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Product Details</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Product Title</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium" placeholder="e.g. Personalized Magic Mirror" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
              <textarea rows="6" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none" placeholder="Explain the features and customization options..." required />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Product Media</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previews.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                <img src={img} className="w-full h-full object-cover" alt="preview" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
              <Upload className="text-gray-400 group-hover:text-blue-500 mb-2" size={24} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Add Photo</span>
              <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Inventory & Price</h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Selling Price (INR)</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-black" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold appearance-none">
              {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Stock Quantity</label>
            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Publish Product</>}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;