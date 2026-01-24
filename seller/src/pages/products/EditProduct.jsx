import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductDetails, updateProduct, clearProductErrors, clearCurrentProduct } from "../../store/productSlice";
import ProductForm from "../../components/product/ProductForm";
import Loader from "../../components/common/Loader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/products")} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
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
        isEdit={true}
      />
    </div>
  );
};

export default EditProduct;