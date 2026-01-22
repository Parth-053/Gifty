import React from 'react';
import { MapPin, Phone, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const AddressCard = ({ address, onEdit, onDelete, onSelect, selected }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(address)}
      className={`
        relative p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between h-full
        ${selected 
          ? 'border-blue-600 bg-blue-50/30' 
          : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
        }
      `}
    >
      {/* Selection Checkmark */}
      {selected && (
        <div className="absolute top-4 right-4 text-blue-600">
          <CheckCircle2 size={22} fill="currentColor" className="text-white" />
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`mt-1 p-2 rounded-full ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
            <MapPin size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gray-200">
                {address.type || 'Home'}
              </span>
              {address.isDefault && (
                <span className="text-[10px] font-bold text-green-600">Default</span>
              )}
            </div>
            <h4 className="font-bold text-gray-900 text-sm mt-1 line-clamp-1">{address.fullName || address.name}</h4>
          </div>
        </div>

        {/* Address Body */}
        <p className="text-gray-500 text-sm leading-relaxed pl-11 mb-2">
          {address.street}, {address.city}, {address.state}
          <br />
          <span className="font-bold text-gray-900">{address.postalCode}</span>
        </p>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm pl-11 font-medium">
          <Phone size={14} /> {address.phone}
        </div>
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-5 pl-11 pt-4 border-t border-gray-50">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(address); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-1"
            >
              <Edit2 size={12} /> Edit
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;