import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/categorySlice";
import Input from "../common/Input";
import Button from "../common/Button";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ProductForm = ({ initialData, onSubmit, isLoading, isEdit = false }) => {
  const dispatch = useDispatch();
  const { list: categories } = useSelector((state) => state.categories);

  // Form State
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    isCustomizable: false,
  });

  const [images, setImages] = useState([]);  
  const [existingImages, setExistingImages] = useState([]);  
  const [previews, setPreviews] = useState([]);  

  useEffect(() => {
    dispatch(fetchCategories());
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        originalPrice: initialData.originalPrice || "",
        stock: initialData.stock || "",
        category: initialData.category?._id || initialData.category || "",
        isCustomizable: initialData.isCustomizable || false,
      });
      // Handle existing images properly
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
      }
    }
  }, [dispatch, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    // Note: Actual deletion from cloud usually happens on Save, 
    // but here we just filter them out from the UI list.
    // Logic to track deleted images can be added if backend supports specific image deletion.
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("originalPrice", form.originalPrice);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("isCustomizable", form.isCustomizable);

    // Append new images
    images.forEach(img => {
      formData.append("images", img);
    });
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border px-3"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="MRP (₹)" type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} required min="0" />
        <Input label="Selling Price (₹)" type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
        <Input label="Stock" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isCustomizable"
          name="isCustomizable"
          checked={form.isCustomizable}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
        />
        <label htmlFor="isCustomizable" className="text-sm font-medium text-gray-700">
          Is Customizable?
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 5)</label>
        <div className="flex flex-wrap gap-4">
          
          {/* Existing Images (Edit Mode) */}
          {existingImages.map((img, idx) => (
            <div key={`existing-${idx}`} className="relative h-24 w-24 border rounded-lg overflow-hidden group">
              <img src={img.url} alt="product" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* New Previews */}
          {previews.map((src, idx) => (
            <div key={`new-${idx}`} className="relative h-24 w-24 border rounded-lg overflow-hidden group">
              <img src={src} alt="preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {(images.length + existingImages.length) < 5 && (
            <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <PhotoIcon className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add</span>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {isEdit ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;