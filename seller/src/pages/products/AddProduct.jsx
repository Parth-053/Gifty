import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductForm from '../../components/product/ProductForm';
import { addProduct } from '../../store/productSlice'; // Redux action
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  const handleSubmit = async (formData) => {
    // API Call via Redux
    const resultAction = await dispatch(addProduct(formData));
    
    if (addProduct.fulfilled.match(resultAction)) {
      toast.success('Product added successfully!');
      navigate('/products');
    } else {
      toast.error(resultAction.payload || "Failed to add product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a new item for your store.</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddProduct;