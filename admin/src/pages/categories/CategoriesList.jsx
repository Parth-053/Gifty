import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import CategoryTable from '../../components/tables/CategoryTable';
import Pagination from '../../components/common/Pagination';

const CategoriesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy Categories
  const categories = [
    { id: 1, name: 'Electronics', productsCount: 120, status: 'Active', image: 'https://images.unsplash.com/photo-1498049860654-af5a11f28d05?w=100' },
    { id: 2, name: 'Fashion', productsCount: 350, status: 'Active', image: 'https://images.unsplash.com/photo-1445205170230-05328324f37f?w=100' },
    { id: 3, name: 'Home & Decor', productsCount: 85, status: 'Inactive', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100' },
    { id: 4, name: 'Books', productsCount: 200, status: 'Active', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=100' },
  ];

  // Filter Logic
  const filteredData = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Manage store categories and sub-categories.</p>
        </div>
        <button 
          onClick={() => navigate('/categories/add')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full md:w-80 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
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

      {/* Table Component */}
      <CategoryTable 
        categories={filteredData}
        onEdit={(cat) => navigate(`/categories/edit/${cat.id}`)}
        onDelete={(id) => alert(`Delete category ID: ${id}`)}
      />

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={5} 
        onPageChange={setCurrentPage} 
      />

    </div>
  );
};

export default CategoriesList;