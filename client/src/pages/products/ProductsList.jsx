import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import ProductTable from '../../components/tables/ProductTable';
import Pagination from '../../components/common/Pagination';
import Toast from '../../components/common/Toast';

const ProductsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState(null);

  // Dummy Data
  const products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2999, stock: 45, sellerName: "TechWorld", status: "Active", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
    { id: 2, name: "Running Shoes", category: "Fashion", price: 1499, stock: 120, sellerName: "ShoeZone", status: "Active", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" },
    { id: 3, name: "Smart Watch", category: "Electronics", price: 3999, stock: 10, sellerName: "GadgetHub", status: "Pending", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" },
    { id: 4, name: "Leather Bag", category: "Fashion", price: 2499, stock: 5, sellerName: "BagHouse", status: "Rejected", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100" },
  ];

  const handleAction = (action, item) => {
    if (action === 'view') {
      navigate(`/products/${item.id}`);
    } else if (action === 'approve') {
      setToast({ type: 'success', message: 'Product Approved Successfully' });
    } else if (action === 'reject') {
      setToast({ type: 'error', message: 'Product Rejected' });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">Manage catalog and approvals.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setFilterStatus('Pending')} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold border border-orange-100 hover:bg-orange-100">
             Pending Approval
           </button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full sm:w-80 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
               type="text" 
               placeholder="Search products..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent outline-none text-sm w-full font-medium"
            />
         </div>
         <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-600 outline-none cursor-pointer border border-transparent hover:bg-gray-100"
         >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
         </select>
      </div>

      <ProductTable products={filteredProducts} onAction={handleAction} />
      <Pagination currentPage={1} totalPages={5} onPageChange={()=>{}} />
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProductsList;