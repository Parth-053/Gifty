import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '../../components/categories/CategoryForm';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [toast, setToast] = useState(null);

  // Mock Parent Categories
  const parentCategories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Fashion' },
  ];

  useEffect(() => {
    // Simulate Fetching Data
    setTimeout(() => {
      setInitialData({
        id: id,
        name: 'Smartphones',
        parentId: '1', // Electronics
        status: 'Active',
        description: 'All kinds of mobile phones and accessories.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'
      });
      setFetching(false);
    }, 1000);
  }, [id]);

  const handleSubmit = (formData) => {
    setLoading(true);
    console.log("Updated Data:", formData);
    
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Category updated successfully!' });
      setTimeout(() => navigate('/categories'), 1500);
    }, 1500);
  };

  if (fetching) return <Loader fullScreen text="Loading Category..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <CategoryForm 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isLoading={loading}
          categories={parentCategories}
        />
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EditCategory;