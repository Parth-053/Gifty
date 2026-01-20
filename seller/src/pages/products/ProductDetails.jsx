import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Edit, Package, DollarSign, BarChart, Loader2 } from 'lucide-react';
import { fetchProductById } from '../../store/productSlice';
import { formatPrice } from '../../utils/formatPrice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct: product, fetchLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (fetchLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       
       {/* Header with Dynamic Name */}
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg text-gray-500">
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Product Details</h1>
          </div>
          <button 
            onClick={() => navigate(`/products/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm"
          >
            <Edit size={16} /> Edit Product
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image & Description */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/500'} 
                  alt={product.name} 
                  className="w-full h-96 object-cover rounded-xl" 
                />
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
             </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <DollarSign size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Price</p>
                      <p className="text-xl font-extrabold text-gray-900">{formatPrice(product.price)}</p>
                   </div>
                </div>
                {/* Other Stats like Stock, Revenue, etc. */}
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <Package size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Current Stock</p>
                      <p className={`text-xl font-extrabold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} units
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProductDetails;