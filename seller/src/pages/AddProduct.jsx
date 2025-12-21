import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const AddProduct = () => {
  const { id } = useParams(); 

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h1>

      <ProductForm productId={id} />
    </div>
  );
};

export default AddProduct;
