import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, deleteBanner } from '../../store/bannerSlice';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const BannersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: banners, loading } = useSelector((state) => state.banners);

  // Load Banners on Mount
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await dispatch(deleteBanner(id)).unwrap();
        toast.success("Banner deleted successfully");
      } catch {
        toast.error("Failed to delete banner");
      }
    }
  };

  if (loading && banners.length === 0) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Banners & Promotions</h1>
        <button 
          onClick={() => navigate('/banners/add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
           <ImageIcon className="mx-auto text-gray-300 mb-2" size={48} />
           <p className="text-gray-500">No banners active. Create one to boost sales!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm group hover:shadow-md transition">
              {/* Image Container */}
              <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={banner.image?.url} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded backdrop-blur-md uppercase tracking-wide">
                   {banner.type}
                </div>
              </div>
              
              {/* Info & Actions */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{banner.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
                    <span className="text-xs text-gray-500 font-medium">
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersList;