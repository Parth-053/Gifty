import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '../../components/categories/CategoryForm';
import Toast from '../../components/common/Toast'; // Assuming you copied Toast from Seller Side

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Mock Parent Categories for Dropdown
  const parentCategories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Fashion' },
  ];

  const handleSubmit = (formData) => {
    setLoading(true);
    console.log("New Category Data:", formData);

    // 🔥 Dummy API Call
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Category added successfully!' });
      setTimeout(() => navigate('/categories'), 1500);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <CategoryForm 
          onSubmit={handleSubmit} 
          isLoading={loading}
          categories={parentCategories}
        />
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AddCategory;