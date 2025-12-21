import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import API_URL from "../../config/api";

const ProductsGrid = ({ selectedCategory, sort, rating }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();

      // CATEGORY (optional)
      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      // FILTERS
      if (sort) params.append("sort", sort);
      if (rating) params.append("rating", rating);

      const url = `${API_URL}/api/products?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [selectedCategory, sort, rating]); 

  return (
    <div className="grid grid-cols-2 gap-4 pb-10">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
