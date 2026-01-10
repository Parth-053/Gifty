import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import ProductForm from '../../components/product/ProductForm';
import Toast from '../../components/common/Toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (formData) => {
    setLoading(true);
    console.log("Adding Product:", formData);

    // 🔥 Dummy API Call
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Product added successfully!' });
      
      // Navigate after short delay
      setTimeout(() => navigate('/products'), 1500);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-lg hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a new item for your store.</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={loading} 
      />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

    </div>
  );
};

export default AddProduct;