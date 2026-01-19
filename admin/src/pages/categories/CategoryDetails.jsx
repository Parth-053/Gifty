import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Package, Layers } from 'lucide-react';
import api from '../../api/axios'; 
import Loader from '../../components/common/Loader';

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Single Category
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/categories/${id}`); // Assuming public/admin route exists
        setCategory(data.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Loader />;
  if (!category) return <div className="p-6">Category not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white text-gray-500 transition">
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
               <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                 {category.image ? (
                   <img src={category.image.url} alt={category.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                 )}
               </div>
               <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
               <div className="mt-2 flex flex-wrap gap-2">
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${category.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   {category.isActive ? 'Active' : 'Inactive'}
                 </span>
                 {category.parentId && (
                   <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1">
                     <Layers size={10} /> Sub-category
                   </span>
                 )}
               </div>
            </div>
         </div>

         {/* Info Card */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-2">Description</h3>
               <p className="text-gray-500 text-sm leading-relaxed">
                 {category.description || "No description provided."}
               </p>
            </div>

            {/* If backend returns children here, display them */}
            {category.children && category.children.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-4">
                    <Package className="text-blue-500" size={20} />
                    <h3 className="font-bold text-gray-800">Sub-Categories ({category.children.length})</h3>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {category.children.map((sub) => (
                       <span 
                         key={sub._id} 
                         onClick={() => navigate(`/categories/${sub._id}`)}
                         className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100"
                       >
                          {sub.name}
                       </span>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CategoryDetails;