import React from 'react';
import { Trash2, Ban } from 'lucide-react';

const UserTable = ({ users, onBlock, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                         {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{user.name}</span>
                   </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{user.email}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{user.role}</td>
                <td className="py-4 px-6">
                   <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    user.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onBlock(user.id)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg" title="Block User">
                      <Ban size={18} />
                    </button>
                    <button onClick={() => onDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete User">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;