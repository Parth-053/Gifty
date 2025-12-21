import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import ProductDetailHeader from "../components/ProductDetailHeader";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductDescription from "../components/ProductDescription";
import ProductActions from "../components/ProductActions";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------------
     OPTIONAL AUTH GUARD
     (Enable only if you want
     product page protected)
     ------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // comment this line if product detail should be public
      // navigate("/login");
    }
  }, [navigate]);

  /* -------------------------
     FETCH PRODUCT
     ------------------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      <ProductDetailHeader />

      <ProductImageGallery images={product.images} />

      <ProductInfo product={product} />

      <ProductDescription description={product.description} />

      {/* ProductActions already handles login check */}
      <ProductActions productId={product._id} />
    </div>
  );
};

export default ProductDetail;
