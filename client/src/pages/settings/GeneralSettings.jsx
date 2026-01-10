import React, { useState } from 'react';
import { Save, Globe, Lock, Mail } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    siteTitle: 'My E-Commerce Store',
    supportEmail: 'support@mystore.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'Settings updated successfully!' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">General Settings</h1>
        <p className="text-sm text-gray-500">Configure global site preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
           <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Site Information</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Site Title" 
                name="siteTitle" 
                value={settings.siteTitle} 
                onChange={handleChange} 
                icon={Globe}
              />
              <Input 
                label="Support Email" 
                name="supportEmail" 
                value={settings.supportEmail} 
                onChange={handleChange} 
                icon={Mail}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                options={[
                   { value: 'INR', label: 'Indian Rupee (₹)' },
                   { value: 'USD', label: 'US Dollar ($)' },
                   { value: 'EUR', label: 'Euro (€)' }
                ]}
              />
              <Select 
                label="Timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                options={[
                   { value: 'Asia/Kolkata', label: '(GMT+05:30) Kolkata' },
                   { value: 'UTC', label: '(GMT+00:00) UTC' }
                ]}
              />
           </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div className="flex gap-4">
              <div className={`p-3 rounded-full ${settings.maintenanceMode ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                 <Lock size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-800">Maintenance Mode</h3>
                 <p className="text-sm text-gray-500">Enable this to show a "Under Construction" page to visitors.</p>
              </div>
           </div>
           
           <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="maintenanceMode"
                checked={settings.maintenanceMode} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
           </label>
        </div>

        <div className="flex justify-end">
           <Button type="submit" isLoading={loading} icon={Save} size="lg">Save Changes</Button>
        </div>

      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default GeneralSettings;