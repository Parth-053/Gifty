import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download } from 'lucide-react';

// Components
import ProductTable from '../../components/product/ProductTable';
import Pagination from '../../components/common/Pagination';

const ProductList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy Data
  const products = [
    { id: 1, name: "Personalized Mug", category: "Kitchen", price: 499, stock: 120, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100" },
    { id: 2, name: "LED Lamp 3D", category: "Decor", price: 999, stock: 5, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100" },
    { id: 3, name: "Custom T-Shirt", category: "Fashion", price: 699, stock: 0, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
    { id: 4, name: "Wooden Frame", category: "Decor", price: 899, stock: 45, image: "https://images.unsplash.com/photo-1534349762942-5d22f6723b73?w=100" },
    { id: 5, name: "Couple Keychains", category: "Gifts", price: 299, stock: 200, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100" },
  ];

  // Filtering Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
               <Download size={18} /> Export
            </button>
            <button 
               onClick={() => navigate('/products/add')}
               className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
               <Plus size={18} /> Add Product
            </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-2">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full sm:w-80 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
               type="text" 
               placeholder="Search products..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent outline-none text-sm w-full font-medium text-gray-700"
            />
         </div>
         <div className="flex gap-2 w-full sm:w-auto">
             <button className="p-2.5 flex-1 sm:flex-none text-gray-500 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors flex items-center justify-center gap-2">
                <Filter size={18} /> <span className="sm:hidden text-xs font-bold">Filter</span>
             </button>
         </div>
      </div>

      {/* 3. Product Table */}
      <ProductTable 
         products={filteredProducts}
         onEdit={(product) => navigate(`/products/edit/${product.id}`)}
         onDelete={(id) => alert(`Delete Product ID: ${id}`)}
      />

      {/* 4. Pagination */}
      <Pagination 
         currentPage={currentPage}
         totalPages={5}
         onPageChange={(page) => setCurrentPage(page)}
      />

    </div>
  );
};

export default ProductList;