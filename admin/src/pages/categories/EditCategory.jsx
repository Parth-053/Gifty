import React, { useEffect, useState } from "react";
// FIX: Correctly import Redux hooks from 'react-redux' only
import { useDispatch, useSelector } from "react-redux";
// FIX: Correctly import Router hooks from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import { updateCategory, fetchCategories, clearCategoryErrors } from "../../store/categorySlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CategoryForm from "../../components/categories/CategoryForm";
import Loader from "../../components/common/Loader";

const EditCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { categories, loading, actionLoading, error } = useSelector((state) => state.categories);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(clearCategoryErrors());
    // Ensure we have categories loaded to find the current one
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Find the specific category to edit from the Redux store
  useEffect(() => {
    if (categories.length > 0 && id) {
      const cat = categories.find((c) => c._id === id);
      if (cat) {
        setCurrentCategory(cat);
      }
    }
  }, [categories, id]);

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Use unwrap to handle success/failure in this component
      await dispatch(updateCategory({ id, formData })).unwrap();
      navigate("/categories");
    } catch (err) {
      console.error("Failed to update category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading only if fetching initial list
  if (loading && categories.length === 0) {
    return <div className="flex h-64 items-center justify-center"><Loader /></div>;
  }

  // If finished loading but category not found
  if (!loading && categories.length > 0 && !currentCategory) {
    return <div className="p-6 text-red-500">Category not found.</div>;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-sm text-gray-500">Update category details.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
          {typeof error === 'string' ? error : "An error occurred saving the category."}
        </div>
      )}

      {/* Only render form when data is ready */}
      {currentCategory && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <CategoryForm 
            initialData={currentCategory} 
            onSubmit={handleSubmit} 
            // Tell the form it's in Edit Mode
            isEdit={true}
            loading={actionLoading || isSubmitting} 
          />
        </div>
      )}
    </div>
  );
};

export default EditCategory;