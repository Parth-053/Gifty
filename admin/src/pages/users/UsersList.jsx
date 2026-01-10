import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserTable from '../../components/tables/UserTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "Amit Sharma", email: "amit@example.com", role: "Customer", status: "Active" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", role: "Customer", status: "Active" },
    { id: 3, name: "Rohan Verma", email: "rohan@example.com", role: "Customer", status: "Blocked" },
  ];

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (id) => {
    setSelectedUser(id);
    setShowConfirm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 rounded-lg py-2 w-64">
           <Search size={18} className="text-gray-400" />
           <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
           />
        </div>
      </div>

      <UserTable users={filteredUsers} onBlock={() => {}} onDelete={handleDelete} />
      <Pagination currentPage={1} totalPages={2} onPageChange={()=>{}} />

      <ConfirmDialog 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)} 
        title="Delete User"
        message="Are you sure you want to remove this user? This cannot be undone."
        onConfirm={() => { setShowConfirm(false); alert('User Deleted'); }}
      />
    </div>
  );
};

export default UsersList;