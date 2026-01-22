import React, { useState } from 'react';
import { Store, Upload, Save, Power, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StoreSettings = () => {
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState({
    name: '',
    description: '',
    vacationMode: false
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/seller/profile/store', store);
      toast.success('Store settings updated!');
    } catch  {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
         <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex gap-3">
               <div className="p-2 bg-white rounded-xl text-orange-600 shadow-sm"><Power size={20} /></div>
               <div>
                  <h4 className="text-sm font-bold text-gray-800">Vacation Mode</h4>
                  <p className="text-[10px] text-gray-500">Temporarily hide your products from the shop.</p>
               </div>
            </div>
            <button 
              onClick={() => setStore({...store, vacationMode: !store.vacationMode})}
              className={`w-12 h-6 rounded-full transition-all relative ${store.vacationMode ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${store.vacationMode ? 'left-7' : 'left-1'}`} />
            </button>
         </div>
         
         <button onClick={handleSave} disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Settings</>}
         </button>
      </div>
    </div>
  );
};
 
export default StoreSettings;