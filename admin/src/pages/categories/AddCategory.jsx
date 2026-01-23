import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../store/categorySlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CategoryForm from "../../components/categories/CategoryForm";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.categories);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createCategory(formData));
    if (createCategory.fulfilled.match(resultAction)) {
      navigate("/categories");
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
          {error}
        </div>
      )}

      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddCategory;