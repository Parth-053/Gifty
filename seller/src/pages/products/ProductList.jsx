import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import ProductTable from '../../components/product/ProductTable';
import toast from 'react-hot-toast'; // Ensure toast is imported if used
import { fetchSellerProducts, deleteProduct } from '../../store/productSlice';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(result)) toast.success("Deleted!");
    }
  };

  // Safe filtering (handle undefined items)
  const filteredProducts = items?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-sm text-gray-500">Manage your catalog and stock levels.</p>
        </div>
        <button 
          onClick={() => navigate('/products/add')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-2 shadow-sm">
        <Search size={18} className="text-gray-400 mt-2" />
        <input 
          type="text" 
          placeholder="Search your products..." 
          className="outline-none w-full text-sm py-1"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
      ) : (
        <ProductTable 
          products={filteredProducts}
          onEdit={(p) => navigate(`/products/edit/${p._id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductList;