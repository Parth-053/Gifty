import React, { useEffect, useState } from 'react';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddressCard from '../../components/user/AddressCard';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    type: 'Home',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/user/addresses/${editingId}`, form);
        toast.success("Address updated");
      } else {
        await api.post('/user/addresses', form);
        toast.success("Address added");
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm({ name: '', street: '', city: '', state: '', postalCode: '', phone: '', type: 'Home', isDefault: false });
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch  {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-gray-900">Saved Addresses</h1>
        </div>
        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> <span className="hidden sm:inline font-bold">Add New</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-bold mb-4">No addresses saved yet</p>
          <Button onClick={() => setIsModalOpen(true)} size="sm">Add Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <AddressCard 
              key={addr._id} 
              address={addr} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Address" : "Add New Address"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <Input label="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          <Input label="Address (House No, Street)" value={form.street} onChange={e => setForm({...form, street: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
            <Input label="Pincode" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} required />
          </div>
          <Input label="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required />
          
          <div className="flex gap-4 pt-2">
            {['Home', 'Work', 'Other'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({...form, type})}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${form.type === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 pt-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.isDefault} 
              onChange={e => setForm({...form, isDefault: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-gray-700">Make this my default address</span>
          </label>

          <Button type="submit" fullWidth className="mt-4">Save Address</Button>
        </form>
      </Modal>
    </div>
  );
};

export default SavedAddresses;