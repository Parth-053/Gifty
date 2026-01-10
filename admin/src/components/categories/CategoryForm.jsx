import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import CategoryImageUpload from './CategoryImageUpload';
import CategoryStatusToggle from './CategoryStatusToggle';
import { Save } from 'lucide-react';

const CategoryForm = ({ initialData, onSubmit, isLoading, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    status: 'Active',
    description: '',
    image: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        parentId: initialData.parentId || '',
        status: initialData.status || 'Active',
        description: initialData.description || '',
        image: initialData.image || null
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Name Input */}
      <Input 
        label="Category Name" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        placeholder="e.g. Electronics" 
        required 
      />

      {/* Parent Category Select */}
      <Select 
        label="Parent Category (Optional)" 
        name="parentId" 
        value={formData.parentId} 
        onChange={handleChange}
        placeholder="Select Parent Category"
        options={categories.map(c => ({ value: c.id, label: c.name }))}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
        <textarea 
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          placeholder="Short description..."
        />
      </div>

      {/* Image Upload */}
      <CategoryImageUpload 
        image={formData.image} 
        onChange={(file) => setFormData({ ...formData, image: file })} 
      />

      {/* Status Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div>
           <span className="block text-sm font-bold text-gray-800">Status</span>
           <span className="text-xs text-gray-500">{formData.status === 'Active' ? 'Visible in store' : 'Hidden from store'}</span>
        </div>
        <CategoryStatusToggle 
          isActive={formData.status === 'Active'} 
          onToggle={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })} 
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isLoading}
        icon={Save}
      >
        {initialData ? 'Update Category' : 'Create Category'}
      </Button>

    </form>
  );
};

export default CategoryForm;