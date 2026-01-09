import React from 'react';
import { Trash2, Edit2, MapPin } from 'lucide-react';

const AddressCard = ({ address, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex gap-3">
      <div className="mt-1 text-[#FF6B6B]">
        <MapPin size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <h3 className="text-sm font-bold text-gray-800">{address.type}</h3>
           <div className="flex gap-3">
              <button onClick={() => onEdit(address.id)} className="text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
              <button onClick={() => onDelete(address.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
           </div>
        </div>
        <p className="text-sm font-semibold text-gray-700 mt-1">{address.name} <span className="text-xs font-normal text-gray-500">({address.phone})</span></p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{address.fullAddress}</p>
      </div>
    </div>
  );
};

export default AddressCard;