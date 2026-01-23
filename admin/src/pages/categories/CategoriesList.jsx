import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories, deleteCategory } from "../../store/categorySlice";
import { PlusIcon } from "@heroicons/react/24/outline";

// Components
import CategoryTable from "../../components/tables/CategoryTable";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const CategoriesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    navigate(`/categories/edit/${category._id}`);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      await dispatch(deleteCategory(selectedCategory._id));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product categories and sub-categories.</p>
        </div>
        <Button onClick={() => navigate("/categories/add")}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      {categories.length > 0 ? (
        <CategoryTable 
          categories={categories} 
          onEdit={handleEdit} 
          onDelete={handleDeleteClick} 
        />
      ) : (
        !loading && (
          <EmptyState
            title="No categories found"
            description="Create categories to organize your products."
            action={<Button onClick={() => navigate("/categories/add")}>Create First Category</Button>}
          />
        )
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This might affect products linked to this category.`}
        isLoading={loading}
      />
    </div>
  );
};

export default CategoriesList;