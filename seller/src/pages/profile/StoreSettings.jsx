import React, { useState } from 'react';
import { Store, Upload, Save, Power } from 'lucide-react';
import Toast from '../../components/common/Toast';

const StoreSettings = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [store, setStore] = useState({
    name: "John's Gift Shop",
    description: "Specializing in personalized gifts for all occasions.",
    logo: "https://via.placeholder.com/150",
    vacationMode: false
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Store settings saved!' });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
        <p className="text-sm text-gray-500">Customize how your store looks to customers.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
         
         {/* Logo Upload */}
         <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Store Logo</label>
            <div className="flex items-center gap-4">
               <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img src={store.logo} alt="Store Logo" className="w-full h-full object-cover" />
               </div>
               <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                     <Upload size={16} /> Upload New
                  </button>
                  <p className="text-xs text-gray-400 mt-2">Recommended size: 500x500px</p>
               </div>
            </div>
         </div>

         {/* Store Info */}
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
               <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
                  <Store size={18} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={store.name} 
                    onChange={(e) => setStore({...store, name: e.target.value})}
                    className="bg-transparent outline-none w-full text-sm font-medium" 
                  />
               </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
               <textarea 
                  rows="3"
                  value={store.description} 
                  onChange={(e) => setStore({...store, description: e.target.value})}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
               />
            </div>
         </div>

         {/* Vacation Mode */}
         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-start gap-3">
               <div className={`p-2 rounded-full ${store.vacationMode ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
                  <Power size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-800">Vacation Mode</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Temporarily close your store and hide products.</p>
               </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
               <input 
                 type="checkbox" 
                 className="sr-only peer" 
                 checked={store.vacationMode}
                 onChange={() => setStore({...store, vacationMode: !store.vacationMode})}
               />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
         </div>

         <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all disabled:opacity-70"
            >
               {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
            </button>
         </div>

      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default StoreSettings;