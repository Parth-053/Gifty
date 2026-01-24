import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../store/productSlice";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (loading || !product) return <div className="h-96 flex justify-center items-center"><Loader /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/products")} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
        <Link to={`/products/edit/${product._id}`}>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <PencilSquareIcon className="h-5 w-5" /> Edit
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Images Section */}
          <div className="p-6 bg-gray-50 border-r border-gray-200">
            <div className="aspect-square rounded-lg overflow-hidden bg-white mb-4 border border-gray-200">
              <img 
                src={product.images?.[0]?.url || "https://via.placeholder.com/400"} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, i) => (
                <div key={i} className="aspect-square rounded-md overflow-hidden border border-gray-200 bg-white">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-8 space-y-6">
            <div>
              <Badge variant="info" className="mb-2">{product.category?.name || "Category"}</Badge>
              <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Stock Status:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="prose text-gray-600 text-sm">
              <h4 className="text-gray-900 font-semibold mb-2">Description</h4>
              <p>{product.description}</p>
            </div>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500">Customizable</span>
                <span className="font-medium text-gray-900">{product.isCustomizable ? "Yes" : "No"}</span>
              </div>
              <div>
                <span className="block text-gray-500">Product ID</span>
                <span className="font-medium text-gray-900 font-mono">{product._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;