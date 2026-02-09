import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../store/productSlice";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import ProductTable from "../../components/product/ProductTable";  
import ProductCard from "../../components/product/ProductCard";  
import EmptyState from "../../components/common/EmptyState";
import { PlusIcon, CubeIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages, currentPage } = useSelector((state) => state.products);
  
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(id));
      dispatch(fetchProducts({ page, limit: 10 })); // Refresh list
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory and listings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center">
            <button 
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          </div>

          <Link to="/products/add">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm hover:shadow">
              <PlusIcon className="h-5 w-5" /> Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {items && items.length > 0 ? (
          <>
            {/* Table View */}
            <div className={`${viewMode === 'grid' ? 'hidden' : 'block'}`}>
              <ProductTable products={items} onDelete={handleDelete} />
            </div>

            {/* Grid View */}
            <div className={`${viewMode === 'table' ? 'hidden' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
               {items.map(product => (
                 <ProductCard key={product._id} product={product} onDelete={handleDelete} />
               ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={CubeIcon}
            title="No products found"
            description="Get started by adding your first product to the inventory."
            action={
              <Link to="/products/add">
                <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Add Product
                </button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;