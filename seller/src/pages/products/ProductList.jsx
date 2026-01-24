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
      dispatch(fetchProducts({ page, limit: 10 })); // Refresh
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle (Visible on Desktop) */}
          <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded ${viewMode === "table" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
          </div>

          <Link to="/products/add">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <PlusIcon className="h-5 w-5" /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader />
          </div>
        ) : items.length > 0 ? (
          <>
            {/* Desktop View: Table */}
            <div className={`hidden md:block ${viewMode === 'grid' ? 'hidden' : ''}`}>
               <ProductTable products={items} onDelete={handleDelete} />
            </div>

            {/* Grid View (Desktop Option) */}
            <div className={`hidden md:grid ${viewMode === 'table' ? 'hidden' : 'grid-cols-3 lg:grid-cols-4 gap-6 p-6'}`}>
               {items.map(product => (
                 <ProductCard key={product._id} product={product} onDelete={handleDelete} />
               ))}
            </div>

            {/* Mobile View: Always Cards (Table is bad on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
              {items.map(product => (
                <ProductCard key={product._id} product={product} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200">
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