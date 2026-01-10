import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import ProductForm from '../../components/product/ProductForm';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [toast, setToast] = useState(null);

  // Fetch Product Data (Dummy)
  useEffect(() => {
    // Simulate fetching data for ID
    setTimeout(() => {
      setInitialData({
        id: id,
        name: "Personalized Mug",
        price: 499,
        stock: 120,
        category: "Kitchen",
        description: "High quality ceramic mug with custom print.",
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300"]
      });
      setFetching(false);
    }, 1000);
  }, [id]);

  const handleSubmit = (formData) => {
    setLoading(true);
    console.log("Updating Product:", formData);

    // 🔥 Dummy Update Logic
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Product updated successfully!' });
      setTimeout(() => navigate('/products'), 1500);
    }, 1500);
  };

  if (fetching) return <Loader fullScreen text="Fetching product details..." />;

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
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-sm text-gray-500">Update product details and stock.</p>
        </div>
      </div>

      {/* Form with Initial Data */}
      <ProductForm 
        initialData={initialData}
        onSubmit={handleSubmit} 
        isLoading={loading} 
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

    </div>
  );
};

export default EditProduct;