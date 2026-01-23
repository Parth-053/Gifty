import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBanners, deleteBanner } from "../../store/bannerSlice";
import { PlusIcon } from "@heroicons/react/24/outline";

// Components
import BannerTable from "../../components/tables/BannerTable";  
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const BannersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { banners, loading, error } = useSelector((state) => state.banners);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBanner) {
      await dispatch(deleteBanner(selectedBanner._id));
      setDeleteModalOpen(false);
      setSelectedBanner(null);
    }
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader size="lg" text="Loading banners..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotional Banners</h1>
          <p className="mt-1 text-sm text-gray-500">Manage site-wide banners and sliders.</p>
        </div>
        <Button onClick={() => navigate("/banners/add")}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Banner
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      {banners.length > 0 ? (
        <BannerTable banners={banners} onDelete={handleDeleteClick} />
      ) : (
        !loading && (
          <EmptyState
            title="No banners active"
            description="Create your first banner to showcase deals or announcements."
            action={<Button onClick={() => navigate("/banners/add")}>Create Banner</Button>}
          />
        )
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Banner?"
        message={`Are you sure you want to delete "${selectedBanner?.title}"?`}
        isLoading={loading}
      />
    </div>
  );
};

export default BannersList;