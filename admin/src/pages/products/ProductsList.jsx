import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../store/productSlice";
import { Trash2, Edit, Eye } from "lucide-react";

import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalProducts, loading, error } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const limit = 10;

  useEffect(() => {
    const params = { page, limit, sort: "-createdAt" };
    if (search) params.search = search;

    if (statusFilter === "deleted") {
      params.isDeleted = true;
    } else {
      params.isDeleted = false; // By default, only show active products unless filtered
      if (statusFilter !== "all") params.status = statusFilter;
    }
    
    dispatch(fetchProducts(params));
  }, [dispatch, page, search, statusFilter]);

  const handleEdit = (id) => navigate(`/products/edit/${id}`);
  const handleView = (id) => navigate(`/products/${id}`);
  
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete._id));
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const statusOptions = [
    { value: "all", label: "All Active Inventory" },
    { value: "pending", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "deleted", label: "Deleted Items (Trash)" }
  ];

  // Helper to determine Badge Appearance
  const getStatusBadge = (product) => {
    if (product.isDeleted) {
      return <Badge variant="danger">Deleted</Badge>;
    }
    
    switch (product.verificationStatus) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage, edit, or permanently delete inventory.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
             <Input 
               placeholder="Search products..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg">Error: {error}</div>}

      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader size="lg" /></div>
      ) : products.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" 
                             src={product.images?.[0]?.url || "https://via.placeholder.com/40"} 
                             alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category?.name || "No Category"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.sellerId?.storeName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleView(product._id)} className="text-blue-600 hover:text-blue-900" title="View">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEdit(product._id)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => confirmDelete(product)} className="text-red-600 hover:text-red-900" title="Delete Permanently">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalItems={totalProducts}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </div>
      ) : (
        <EmptyState title="No products found" description="Try changing filters." />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Permanently Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={executeDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
};

export default ProductsList;