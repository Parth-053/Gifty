import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductForm from '../../components/product/ProductForm';
import Loader from '../../components/common/Loader';
import { fetchProductById, updateProduct } from '../../store/productSlice';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, loading, fetchLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateProduct({ id, formData }));
    
    if (updateProduct.fulfilled.match(resultAction)) {
      toast.success('Product updated successfully!');
      navigate('/products');
    } else {
      toast.error(resultAction.payload || "Failed to update product");
    }
  };

  if (fetchLoading) return <Loader fullScreen text="Fetching product details..." />;
  if (!currentProduct) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-lg hover:bg-white text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-sm text-gray-500">Update details for {currentProduct.name}</p>
        </div>
      </div>

      {/* Form with Real Data */}
      <ProductForm 
        onSubmit={handleSubmit} 
        initialData={currentProduct}
        isLoading={loading} 
      />
    </div>
  );
};

export default EditProduct;