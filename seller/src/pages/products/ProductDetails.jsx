import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../store/productSlice";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import { ArrowLeftIcon, PencilSquareIcon, TagIcon } from "@heroicons/react/24/outline";

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
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <PencilSquareIcon className="h-4 w-4" /> Edit Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          
          {/* Images Grid */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img 
                src={product.images?.[0]?.url || "https://via.placeholder.com/400"} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Badge type={product.category || 'General'}>{product.category}</Badge>
                {product.isCustomizable && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md">
                    Customizable
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h2>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-indigo-600">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
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

            {/* Customization Options Display */}
            {product.isCustomizable && product.customizationOptions?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Customization Options</h4>
                <div className="flex flex-wrap gap-2">
                  {product.customizationOptions.map((opt, i) => (
                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Display */}
            {product.tags?.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 text-xs text-gray-400 font-mono">
              Product ID: {product._id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;