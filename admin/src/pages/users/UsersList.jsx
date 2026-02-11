// admin/src/pages/users/UsersList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../store/userSlice";

// Components
import UserTable from "../../components/tables/UserTable";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useDebounce from "../../hooks/useDebounce";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list, total, loading, error } = useSelector((state) => state.users || {});
  const users = list || []; 

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handleView = (id) => {
    navigate(`/users/${id}`);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    // Implementation for delete if you decide to add it later
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage registered customers and administrators.</p>
        </div>
        <div className="w-full sm:w-64">
           <Input 
             placeholder="Search by name or email..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Error: {error}</div>
      )}

      {/* Users List Table */}
      {users.length > 0 ? (
        <>
          <UserTable users={users} onView={handleView} onDelete={handleDeleteClick} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={total || 0}
              itemsPerPage={10}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        !loading && (
          <EmptyState 
            title="No users found" 
            description="Try adjusting your search criteria." 
          />
        )
      )}

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User?"
        message={`Are you sure you want to delete ${selectedUser?.fullName}? This action cannot be undone.`}
        isLoading={loading}
      />
    </div>
  );
};

export default UsersList;