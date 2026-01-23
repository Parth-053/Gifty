import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCategory, fetchCategories } from "../../store/categorySlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CategoryForm from "../../components/categories/CategoryForm";
import Loader from "../../components/common/Loader";

const EditCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Ensure categories are loaded so we can find the current one
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    } else {
      const cat = categories.find((c) => c._id === id);
      if (cat) setCurrentCategory(cat);
      else navigate("/categories"); // Invalid ID
    }
  }, [categories, id, dispatch, navigate]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateCategory({ id, formData }));
    if (updateCategory.fulfilled.match(resultAction)) {
      navigate("/categories");
    }
  };

  if (!currentCategory) {
    return <div className="flex h-screen items-center justify-center"><Loader /></div>;
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
          {error}
        </div>
      )}

      <CategoryForm 
        initialData={currentCategory} 
        onSubmit={handleSubmit} 
        loading={loading} 
        isEdit={true}
      />
    </div>
  );
};

export default EditCategory;