import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';

const BannersList = () => {
  const navigate = useNavigate();

  const banners = [
    { id: 1, title: 'Diwali Sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300', status: 'Active', type: 'Main Slider' },
    { id: 2, title: 'New Arrivals', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300', status: 'Inactive', type: 'Small Banner' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
        <button 
          onClick={() => navigate('/banners/add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm group">
            <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                 {banner.type}
              </div>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{banner.title}</h3>
                <span className={`text-xs font-bold ${banner.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                  ● {banner.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannersList;