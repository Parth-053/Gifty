import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '../../store/categorySlice';
import { Plus, Search } from 'lucide-react';
import CategoryTable from '../../components/tables/CategoryTable';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Load Data
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete all sub-categories too.")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success("Category deleted successfully");
      } catch {
        toast.error("Failed to delete category");
      }
    }
  };

  // Simple Search Filter (Frontend Side)
  // Note: For large datasets, move search to Backend API
  const filterCategories = (cats) => {
    if (!searchQuery) return cats;
    return cats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };
  
  // Flatten tree for searching if needed, or just filter top level
  // Here assuming we just filter top level for simplicity in UI
  const filteredData = filterCategories(categories);

  if (loading && categories.length === 0) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Manage store taxonomy and hierarchy.</p>
        </div>
        <button 
          onClick={() => navigate('/categories/add')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 w-full md:w-96">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
               type="text" 
               placeholder="Search categories..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent outline-none text-sm w-full font-medium text-gray-700"
            />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <CategoryTable 
          categories={filteredData}
          onEdit={(cat) => navigate(`/categories/edit/${cat._id}`)}
          onDelete={(id) => handleDelete(id)}
          onView={(id) => navigate(`/categories/${id}`)}
        />
        
        {categories.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">No categories found. Add one to start.</div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;