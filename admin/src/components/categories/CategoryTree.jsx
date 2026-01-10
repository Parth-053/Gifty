import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2, Folder } from 'lucide-react';

// Recursive Tree Item Component
const TreeItem = ({ node, onEdit, onDelete, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 ${level > 0 ? 'ml-6 border-l border-gray-100' : ''}`}
      >
        <div className="flex items-center gap-3">
          {/* Toggle Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-1 rounded hover:bg-gray-200 text-gray-400 ${!hasChildren ? 'invisible' : ''}`}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Icon & Name */}
          <div className="flex items-center gap-3">
            {node.image ? (
              <img src={node.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Folder size={16} />
              </div>
            )}
            <span className="text-sm font-semibold text-gray-800">{node.name}</span>
            <span className="text-xs text-gray-400">({node.productsCount || 0})</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${node.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
             {node.status}
           </span>
           <button onClick={() => onEdit(node)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
             <Edit2 size={16} />
           </button>
           <button onClick={() => onDelete(node.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      {/* Recursive Children */}
      {isOpen && hasChildren && (
        <div className="animate-fade-in-up">
          {node.children.map((child) => (
            <TreeItem 
              key={child.id} 
              node={child} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const CategoryTree = ({ data, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Category Hierarchy</h3>
      <div className="space-y-1">
        {data.map((node) => (
          <TreeItem 
            key={node.id} 
            node={node} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTree;