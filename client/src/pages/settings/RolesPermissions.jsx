import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, CheckSquare } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const RolesPermissions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Dummy Roles Data
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', users: 2, permissions: ['All Access'] },
    { id: 2, name: 'Manager', users: 5, permissions: ['Products', 'Orders', 'Reports'] },
    { id: 3, name: 'Support', users: 8, permissions: ['Orders', 'Users'] },
  ]);

  const permissionsList = ['Dashboard', 'Products', 'Orders', 'Users', 'Sellers', 'Reports', 'Settings'];

  const handleEdit = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
            <p className="text-sm text-gray-500">Manage team access levels.</p>
         </div>
         <Button onClick={handleAddNew} icon={Plus}>Add New Role</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {roles.map((role) => (
            <div key={role.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(role)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Edit2 size={16}/></button>
                  <button className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={16}/></button>
               </div>

               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} />
               </div>
               
               <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
               <p className="text-sm text-gray-500 mb-4">{role.users} Active Users</p>
               
               <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm, idx) => (
                     <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-100">
                        {perm}
                     </span>
                  ))}
               </div>
            </div>
         ))}
      </div>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? "Edit Role" : "Create New Role"}
      >
         <form className="space-y-6">
            <Input 
               label="Role Name" 
               placeholder="e.g. Content Editor" 
               value={editingRole ? editingRole.name : ''} 
               onChange={()=>{}}
            />
            
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-3">Permissions</label>
               <div className="grid grid-cols-2 gap-3">
                  {permissionsList.map((perm) => (
                     <label key={perm} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{perm}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button>Save Role</Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default RolesPermissions;