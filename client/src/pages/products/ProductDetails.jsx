import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Store, Tag } from 'lucide-react';
import Button from '../../components/common/Button';

const ProductDetails = () => {
  const navigate = useNavigate();
  // Dummy Data
  const product = {
    id: 1, 
    name: "Smart Watch Series 7", 
    category: "Electronics", 
    price: 3999, 
    stock: 10, 
    sellerName: "GadgetHub", 
    status: "Pending", 
    description: "Latest series smart watch with AMOLED display and 2 days battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-lg" />
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                 <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                   <Tag size={14} /> {product.category}
                 </div>
               </div>
               <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
                 {product.status}
               </span>
             </div>

             <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
             
             <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <Store size={20} className="text-blue-600" />
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase">Sold by</p>
                   <p className="text-sm font-bold text-gray-900">{product.sellerName}</p>
                </div>
             </div>

             <div>
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
             </div>
          </div>

          {/* Actions (Only if Pending) */}
          {product.status === 'Pending' && (
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                <Button variant="success" className="w-full" icon={CheckCircle}>Approve Product</Button>
                <Button variant="danger" className="w-full" icon={XCircle}>Reject</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;