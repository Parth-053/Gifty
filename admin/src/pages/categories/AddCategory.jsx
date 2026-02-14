import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCategory, clearCategoryErrors } from "../../store/categorySlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CategoryForm from "../../components/categories/CategoryForm";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use actionLoading for create operations
  const { actionLoading, error } = useSelector((state) => state.categories);
  
  // Local state to force button disable immediately on click
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearCategoryErrors());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    if (isSubmitting) return; // Prevent double clicks
    
    setIsSubmitting(true);
    try {
      // unwrap() throws an error if the action is rejected, allowing us to catch it
      await dispatch(createCategory(formData)).unwrap();
      
      // Only navigate if successful
      navigate("/categories");
    } catch (err) {
      console.error("Failed to create category:", err);
      // Stay on page to show error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/categories")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
          <p className="text-sm text-gray-500">Create a new product category.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
          {typeof error === 'string' ? error : "An error occurred"}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Pass the loading state to the form to disable the submit button */}
        <CategoryForm 
          onSubmit={handleSubmit} 
          loading={actionLoading || isSubmitting} 
        />
      </div>
    </div>
  );
};

export default AddCategory;