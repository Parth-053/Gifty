import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import API_URL from "../config/api";

const ProductsGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url =
        selectedCategory === "All"
          ? `${API_URL}/api/products`
          : `${API_URL}/api/products?category=${selectedCategory}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="grid grid-cols-2 gap-4 pb-10">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
