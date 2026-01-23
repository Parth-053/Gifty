import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";  
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Components
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select"; 

const CategoryForm = ({ initialData, onSubmit, isEdit = false, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Fetch existing categories for the "Parent" dropdown
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "", // Corresponds to model: parentId
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Populate form if Edit Mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        parentId: initialData.parentId?._id || initialData.parentId || "", // Handle populated or unpopulated ID
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
      // Handle existing image preview
      if (initialData.image?.url) {
        setPreviewUrl(initialData.image.url);
      }
    }
  }, [initialData]);

  // Load categories for dropdown on mount
  useEffect(() => {
    dispatch(fetchCategories());
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
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        setValidationError("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValidationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.name) {
      setValidationError("Category Name is required");
      return;
    }

    // For Add Mode: Image is required
    if (!isEdit && !imageFile) {
      setValidationError("Category Image is required");
      return;
    }

    // Prepare FormData to match Backend Controller
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("isActive", formData.isActive);
    
    // Only append parentId if it's selected (Backend expects null or valid ObjectId)
    if (formData.parentId) {
      data.append("parentId", formData.parentId);
    }

    // Append Image if changed
    if (imageFile) {
      data.append("image", imageFile);
    }

    onSubmit(data);
  };

  // Filter out the current category from Parent dropdown (prevent circular parent: A cannot be parent of A)
  const parentOptions = categories
    .filter(cat => !isEdit || cat._id !== initialData?._id)
    .map(cat => ({ value: cat._id, label: cat.name }));

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image { !isEdit && <span className="text-red-500">*</span> }
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${validationError && !imageFile && !isEdit ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500'}`}>
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              required
            />

            {/* Parent Category (Sub-category Logic) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">None (Top Level)</option>
                {parentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select a parent to make this a sub-category.</p>
            </div>
          </div>

          {/* Description */}
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

          {/* Active Toggle */}
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

          {/* Validation Error */}
          {validationError && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {validationError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => navigate("/categories")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;