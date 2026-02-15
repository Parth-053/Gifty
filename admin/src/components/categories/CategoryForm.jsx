import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRootCategories } from "../../store/categorySlice";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Components
import Input from "../common/Input";
import Button from "../common/Button";

const CategoryForm = ({ initialData, onSubmit, isEdit = false, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // FIX 1: Select 'rootCategories' specifically for the dropdown
  const { rootCategories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId?._id || initialData?.parentId || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image?.url || null);
  const [validationError, setValidationError] = useState("");

  // FIX 2: Always fetch root categories on mount so the dropdown is populated
  useEffect(() => {
    dispatch(fetchRootCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        setValidationError("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValidationError("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (isEdit && initialData?.image?.url) {
        setPreviewUrl(initialData.image.url);
    } else {
        setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.name.trim()) {
      setValidationError("Category Name is required");
      return;
    }

    if (!isEdit && !imageFile) {
      setValidationError("Category Image is required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("isActive", formData.isActive);
    
    if (formData.parentId) {
      data.append("parentId", formData.parentId);
    }

    if (imageFile) {
      data.append("image", imageFile);
    }

    onSubmit(data);
  };

  // FIX 3: Use 'rootCategories' for the options instead of all categories
  const parentOptions = rootCategories
    .filter(cat => !isEdit || cat._id !== initialData?._id)
    .map(cat => ({ value: cat._id, label: cat.name }));

  return (
    <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image { !isEdit && <span className="text-red-500">*</span> }
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md relative ${validationError && !imageFile && !isEdit ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500'}`}>
              
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <img src={previewUrl} alt="Preview" className="h-32 w-32 object-contain rounded-md border border-gray-200" />
                    {imageFile && (
                        <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 shadow-sm"
                        title="Revert to original image"
                        >
                        <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        {imageFile ? "New Image Selected" : "Current Image"}
                    </p>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept="image/*" 
                            className="sr-only" 
                            onChange={handleImageChange} 
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">None (Top Level)</option>
                {/* FIX 3: This now maps over rootCategories */}
                {parentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select a parent to make this a sub-category.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Short description of the category..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (Visible to users)
            </label>
          </div>

          {validationError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {validationError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => navigate("/categories")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
    </div>
  );
};

export default CategoryForm;