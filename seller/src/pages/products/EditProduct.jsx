import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductDetails, updateProduct, clearProductErrors, clearCurrentProduct } from "../../store/productSlice";
import ProductForm from "../../components/product/ProductForm";
import Loader from "../../components/common/Loader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, actionLoading, error, successMessage } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    return () => { 
        dispatch(clearProductErrors());
        dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (successMessage) {
      toast.success("Product updated successfully");
      navigate("/products");
      dispatch(clearProductErrors());
    }
  }, [successMessage, navigate, dispatch]);

  const handleSubmit = (formData) => {
    dispatch(updateProduct({ id, data: formData }));
  };

  if (loading || !currentProduct) {
    return <div className="h-96 flex items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        {/* FIX: Added type="button" */}
        <button 
          type="button" 
          onClick={() => navigate("/products")} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">Update product details</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <ProductForm 
        initialData={currentProduct} 
        onSubmit={handleSubmit} 
        isLoading={actionLoading} 
      />
    </div>
  );
};

export default EditProduct;