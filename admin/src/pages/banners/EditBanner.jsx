import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBannerDetails, updateBanner, clearSelectedBanner } from "../../store/bannerSlice";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";

// Components
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
 
const BannerForm = ({ initialData, bannerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.banners);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Initialize State DIRECTLY from initialData
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    type: initialData.type || "Main Slider",
    link: initialData.link || "",
    isActive: initialData.isActive ?? true,
    position: initialData.position || 0,
    startDate: formatDate(initialData.startDate),
    endDate: formatDate(initialData.endDate),
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData.image?.url || null);
  const [validationError, setValidationError] = useState("");

  const TYPE_OPTIONS = [
    { value: "Main Slider", label: "Main Slider (Home)" },
    { value: "Small Banner", label: "Small Banner" },
    { value: "Footer Banner", label: "Footer Banner" },
    { value: "Deal of Day", label: "Deal of Day" },
  ];

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
      if (file.size > 5 * 1024 * 1024) { 
        setValidationError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValidationError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      if (imageFile) {
        data.append("image", imageFile);
      }
      
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("link", formData.link);
      data.append("isActive", formData.isActive);
      data.append("position", formData.position);
      data.append("startDate", formData.startDate);
      if (formData.endDate) {
        data.append("endDate", formData.endDate);
      }

      const resultAction = await dispatch(updateBanner({ id: bannerId, formData: data }));

      if (updateBanner.fulfilled.match(resultAction)) {
        navigate("/banners");
      } else {
        setValidationError(resultAction.payload || "Failed to update banner");
      }
    } catch (err) {
      setValidationError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${validationError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500'}`}>
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain rounded-md" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setPreviewUrl(initialData.image?.url || null); }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
                    title="Undo new image selection"
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
                      <span>Upload a new file</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Leave unchanged to keep existing image.</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Banner Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Target Link (Optional)"
            name="link"
            value={formData.link}
            onChange={handleChange}
          />
          
          <Input
            label="Display Order"
            type="number"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
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
            Active
          </label>
        </div>

        {/* Errors & Buttons */}
        {validationError && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {validationError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={() => navigate("/banners")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Update Banner
          </Button>
        </div>
      </form>
    </div>
  );
};
 
const EditBanner = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedBanner, loading } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBannerDetails(id));
    return () => {
      dispatch(clearSelectedBanner());
    };
  }, [dispatch, id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/banners")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
          <p className="text-sm text-gray-500">Update banner details and image.</p>
        </div>
      </div>

      {/* Logic: Only render Form when data is ready */}
      {loading || !selectedBanner ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <Loader size="lg" />
        </div>
      ) : (
        // Key ensures component remounts if ID changes (though unlikely on this page)
        <BannerForm 
          key={selectedBanner._id} 
          initialData={selectedBanner} 
          bannerId={id} 
        />
      )}
    </div>
  );
};

export default EditBanner;