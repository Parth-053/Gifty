import React from 'react';
import { MapPin, Phone, Trash2, Edit2, CheckCircle2, Home, Briefcase, Star } from 'lucide-react';

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault, 
  isSelectable = false, 
  selected = false,
  onSelect 
}) => {
  // Map Type to Icon
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'work': return <Briefcase size={14} />;
      case 'home': return <Home size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  return (
    <div 
      onClick={() => isSelectable && onSelect && onSelect(address)}
      className={`
        relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full group
        ${selected 
          ? 'border-purple-600 bg-purple-50/50 shadow-sm' 
          : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
        }
        ${isSelectable ? 'cursor-pointer' : ''}
      `}
    >
      {/* --- Top Badges --- */}
      <div className="flex justify-between items-start mb-3">
        {/* Type Badge */}
        <div className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
          ${selected ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}
        `}>
          {getTypeIcon(address.type)}
          {address.type || 'Other'}
        </div>

        {/* Default Badge */}
        {address.isDefault && (
          <div className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle2 size={12} /> DEFAULT
          </div>
        )}
      </div>

      {/* --- Address Content --- */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-base mb-1">
          {address.fullName}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          {address.addressLine1}
          {address.addressLine2 && <>, {address.addressLine2}</>}
          <br />
          {address.city}, {address.state} - <span className="text-gray-900 font-semibold">{address.pincode}</span>
        </p>

        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Phone size={14} className="text-gray-400" /> 
          {address.phone}
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
        
        {onDelete && (
          <>
            <div className="w-px h-4 bg-gray-200" />
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} /> Remove
            </button>
          </>
        )}

        {/* Set Default Button */}
        {!address.isDefault && onSetDefault && (
          <>
            <div className="w-px h-4 bg-gray-200" />
            <button 
              onClick={(e) => { e.stopPropagation(); onSetDefault(address._id); }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <Star size={14} /> Default
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;