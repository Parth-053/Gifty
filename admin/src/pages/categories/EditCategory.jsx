import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategory, fetchCategories } from '../../store/categorySlice';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import CategoryForm from '../../components/categories/CategoryForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const { loading, list } = useSelector((state) => state.categories);

  // 1. Fetch Existing Data & Category List (for dropdown)
  useEffect(() => {
    dispatch(fetchCategories()); // Refresh list for parent dropdown

    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/categories/${id}`);
        setInitialData(data.data);
      } catch {
        toast.error("Category not found");
        navigate('/categories');
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id, dispatch, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateCategory({ id, formData })).unwrap();
      toast.success('Category updated successfully!');
      navigate('/categories');
    } catch (error) {
      toast.error(error || "Update failed");
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <CategoryForm 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isLoading={loading}
          categories={list}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditCategory;