import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const ProductSection = ({ title }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data.slice(0, 4)); 
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="px-4 py-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={() => navigate("/categories")}
          className="text-purple-600 text-sm"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
          >
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="h-32 w-full object-cover"
            />

            <div className="p-2">
              <p className="text-sm font-medium">{product.title}</p>
              <p className="text-purple-700 font-semibold text-sm">
                ₹{product.price}
              </p>

              {product.isCustomizable && (
                <span className="text-xs text-green-600">
                  Customizable
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
