import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Package } from 'lucide-react';

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy Data
  const category = {
    id: id,
    name: 'Electronics',
    status: 'Active',
    description: 'Gadgets, devices, and accessories for tech lovers.',
    image: 'https://images.unsplash.com/photo-1498049860654-af5a11f28d05?w=500',
    productsCount: 150,
    subCategories: ['Mobiles', 'Laptops', 'Cameras', 'Accessories']
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Category Details</h1>
        </div>
        <button 
          onClick={() => navigate(`/categories/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Image Card */}
         <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
               <img src={category.image} alt={category.name} className="w-full h-48 object-cover rounded-lg mb-4" />
               <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
               <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${category.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                 {category.status}
               </span>
            </div>
         </div>

         {/* Info Card */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-2">Description</h3>
               <p className="text-gray-500 text-sm leading-relaxed">{category.description}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-2 mb-4">
                  <Package className="text-blue-500" size={20} />
                  <h3 className="font-bold text-gray-800">Sub-Categories ({category.subCategories.length})</h3>
               </div>
               <div className="flex flex-wrap gap-2">
                  {category.subCategories.map((sub, idx) => (
                     <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-100">
                        {sub}
                     </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CategoryDetails;