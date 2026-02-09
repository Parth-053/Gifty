import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct, clearProductErrors } from "../../store/productSlice";
import ProductForm from "../../components/product/ProductForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading, error, successMessage } = useSelector((state) => state.products);

  useEffect(() => {
    // Clear previous states when entering the page
    dispatch(clearProductErrors());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success("Product created successfully!");
      navigate("/products");
      dispatch(clearProductErrors());
    }
    
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error, navigate, dispatch]);

  const handleSubmit = (formData) => {
    dispatch(createProduct(formData));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        {/* FIX: Added type="button" to prevent form submission behavior */}
        <button 
          type="button" 
          onClick={() => navigate("/products")} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a new listing for your store</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} isLoading={actionLoading} />
    </div>
  );
};

export default AddProduct;