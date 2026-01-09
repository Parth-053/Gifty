import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Hook Import

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 mb-3 flex gap-3 shadow-sm">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <h3 className="text-xs font-bold text-gray-800 line-clamp-2 w-[85%]">{item.name}</h3>
           <button 
             onClick={() => removeFromCart(item.id)} 
             className="text-gray-400 hover:text-red-500 p-1 active:scale-90 transition-transform"
           >
             <Trash2 size={16} />
           </button>
        </div>
        
        {/* Optional Customization Badge */}
        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
           <p className="text-[10px] text-gray-500 bg-gray-50 inline-block px-1.5 rounded mt-1">Customized</p>
        )}

        <div className="flex justify-between items-end mt-2">
           <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
           
           {/* Stepper */}
           <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 border border-gray-200 shadow-sm">
              <button 
                onClick={() => updateQty(item.id, 'dec')} 
                disabled={item.qty === 1} 
                className="text-gray-500 disabled:opacity-30 active:scale-75 transition-transform"
              >
                <Minus size={14} />
              </button>
              
              <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
              
              <button 
                onClick={() => updateQty(item.id, 'inc')} 
                className="text-gray-800 active:scale-75 transition-transform"
              >
                <Plus size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;