import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seller/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>

        <button
          onClick={() => navigate("/products/add")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="h-40 w-full object-cover rounded mb-3"
              />

              <h3 className="font-semibold">{product.title}</h3>

              <p className="text-sm text-gray-500">
                ₹{product.price}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {product.category}
              </p>

              {!product.isApproved && (
                <p className="text-xs text-orange-500 mt-2">
                  Waiting for admin approval
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
