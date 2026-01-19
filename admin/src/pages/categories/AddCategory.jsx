import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, fetchCategories } from '../../store/categorySlice';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '../../components/categories/CategoryForm';
import toast from 'react-hot-toast';

const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, list } = useSelector((state) => state.categories);

  // Load categories for "Parent Category" dropdown
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createCategory(formData)).unwrap();
      toast.success('Category added successfully!');
      navigate('/categories');
    } catch (error) {
      toast.error(error || "Failed to add category");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <CategoryForm 
          onSubmit={handleSubmit} 
          isLoading={loading}
          categories={list} // Pass existing categories for parent selection
        />
      </div>
    </div>
  );
};

export default AddCategory;