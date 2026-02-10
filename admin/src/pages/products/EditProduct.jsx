import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, editProduct, clearCurrentProduct } from "../../store/productSlice";
import { useForm } from "react-hook-form";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Data
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  // Populate Form
  useEffect(() => {
    if (currentProduct) {
      reset({
        name: currentProduct.name,
        shortDescription: currentProduct.shortDescription || "",
        description: currentProduct.description,
        price: currentProduct.price,
        discountPrice: currentProduct.discountPrice || "",
        stock: currentProduct.stock,
        isCustomizable: currentProduct.isCustomizable || false,
        tags: currentProduct.tags ? currentProduct.tags.join(", ") : "", // Convert array to string for input
      });
    }
  }, [currentProduct, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const formData = new FormData();

    // Append Standard Fields
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("shortDescription", data.shortDescription);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("isCustomizable", data.isCustomizable);

    if (data.discountPrice) {
      formData.append("discountPrice", data.discountPrice);
    }

    // Handle Tags (Split string "tag1, tag2" -> Array)
    if (data.tags) {
      const tagsArray = data.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
      // Append each tag individually so backend receives an array
      tagsArray.forEach(tag => formData.append("tags", tag));
    }

    // Handle Images (Note: This page currently only displays existing images, doesn't upload new ones yet)
    // If you add file input, append here: formData.append("images", file);

    const result = await dispatch(editProduct({ id, formData }));
    setSubmitting(false);

    if (!result.error) {
      navigate("/products");
    }
  };

  if (loading || !currentProduct) return <div className="p-10 flex justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <button onClick={() => navigate("/products")} className="text-gray-500 hover:text-gray-700">Cancel</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <Input {...register("name", { required: "Name is required" })} error={errors.name?.message} />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Short Description (Max 300 chars)</label>
            <Input {...register("shortDescription", { maxLength: 300 })} placeholder="Brief summary..." />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <Input type="number" {...register("price", { required: true, min: 0 })} />
          </div>

          {/* Discount Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Discount Price ($)</label>
            <Input type="number" {...register("discountPrice", { min: 0 })} placeholder="Optional" />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <Input type="number" {...register("stock", { required: true, min: 0 })} />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <Input {...register("tags")} placeholder="Gift, Holiday, Special (Comma separated)" />
          </div>
        </div>

        {/* Customizable Checkbox */}
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="isCustomizable" 
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            {...register("isCustomizable")} 
          />
          <label htmlFor="isCustomizable" className="text-sm font-medium text-gray-700">
            This product is customizable
          </label>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Description</label>
          <textarea 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="5"
            {...register("description", { required: "Description is required" })} 
          />
        </div>

        {/* Current Images Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {currentProduct.images?.map((img, idx) => (
              <img key={idx} src={img.url} alt="Product" className="h-24 w-24 object-cover rounded border" />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Note: Image editing is currently disabled in Admin Quick Edit.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button type="submit" isLoading={submitting}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;