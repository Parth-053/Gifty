import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, DollarSign, BarChart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy Data for View
  const product = {
    id: id,
    name: "Personalized Mug",
    price: 499,
    stock: 120,
    category: "Kitchen",
    description: "High quality ceramic mug with custom print. Microwave safe. Perfect for gifts.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    sales: 450,
    revenue: "₹2,24,550"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       
       {/* Header */}
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg text-gray-500">
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Product Details</h1>
          </div>
          <button 
            onClick={() => navigate(`/products/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
          >
             <Edit size={16} /> Edit Product
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Image & Key Info */}
          <div className="space-y-6">
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium mt-2 inline-block">
                   {product.category}
                </span>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{product.description}</p>
             </div>
          </div>

          {/* Right: Stats & Performance */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* Quick Stats Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <DollarSign size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Revenue</p>
                      <p className="text-xl font-extrabold text-gray-900">{product.revenue}</p>
                   </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <Package size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Sales Volume</p>
                      <p className="text-xl font-extrabold text-gray-900">{product.sales} units</p>
                   </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                      <BarChart size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Current Stock</p>
                      <p className="text-xl font-extrabold text-gray-900">{product.stock}</p>
                   </div>
                </div>
             </div>

             {/* Recent Orders for this Product (Mock) */}
             <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                   <h3 className="font-bold text-gray-800">Recent Orders containing this item</h3>
                </div>
                <div className="p-5 text-center text-gray-400 text-sm">
                   <p>No recent orders found for this period.</p>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default ProductDetails;