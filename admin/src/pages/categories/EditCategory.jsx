import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (categories.length > 0) {
      const cat = categories.find((c) => c._id === id);
      if (cat) setCurrentCategory(cat);
      // Don't navigate away automatically in useEffect, might cause loops. Just show not found if missing.
    }
  }, [categories, id]);

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await dispatch(updateCategory({ id, formData })).unwrap();
      navigate("/categories");
    } catch (err) {
      console.error("Failed to update category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !currentCategory) {
    return <div className="flex h-screen items-center justify-center"><Loader /></div>;
  }

  if (!loading && !currentCategory && categories.length > 0) {
    return <div className="p-6">Category not found.</div>;
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
          {typeof error === 'string' ? error : "An error occurred"}
        </div>
      )}

      {currentCategory && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <CategoryForm 
            initialData={currentCategory} 
            onSubmit={handleSubmit} 
            loading={actionLoading || isSubmitting} 
          />
        </div>
      )}
    </div>
  );
};

export default EditCategory;