import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../store/authSlice';
import { 
  LayoutDashboard, Layers, ShoppingBag, Users, Store, 
  ShoppingCart, CreditCard, Image, BarChart2, Settings, 
  LogOut, X, ChevronDown, CheckSquare, DollarSign
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [financeOpen, setFinanceOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">G</div>
            <span className="text-xl font-bold tracking-tight">Gifty<span className="text-blue-500">Admin</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-130px)] custom-scrollbar">
          
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Overview</p>
          <NavLink to="/dashboard" onClick={onClose} className={navLinkClass}><LayoutDashboard size={20} /> Dashboard</NavLink>
          <NavLink to="/analytics" onClick={onClose} className={navLinkClass}><BarChart2 size={20} /> Analytics</NavLink>

          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Management</p>
          <NavLink to="/categories" onClick={onClose} className={navLinkClass}><Layers size={20} /> Categories</NavLink>
          
          <NavLink to="/products" onClick={onClose} className={navLinkClass}><ShoppingBag size={20} /> All Products</NavLink>
          <NavLink to="/approvals/products" onClick={onClose} className={navLinkClass}><CheckSquare size={20} /> Product Approvals</NavLink>

          <NavLink to="/sellers" onClick={onClose} className={navLinkClass}><Store size={20} /> All Sellers</NavLink>
          <NavLink to="/approvals/sellers" onClick={onClose} className={navLinkClass}><CheckSquare size={20} /> Seller Approvals</NavLink>

          <NavLink to="/users" onClick={onClose} className={navLinkClass}><Users size={20} /> Users</NavLink>
          <NavLink to="/orders" onClick={onClose} className={navLinkClass}><ShoppingCart size={20} /> Orders</NavLink>

          <div>
            <button 
              onClick={() => setFinanceOpen(!financeOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-gray-800 hover:text-white`}
            >
              <div className="flex items-center gap-3"><CreditCard size={20} /> Finance</div>
              <ChevronDown size={16} className={`transition-transform ${financeOpen ? 'rotate-180' : ''}`} />
            </button>
            {financeOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <NavLink to="/finance/transactions" onClick={onClose} className={navLinkClass}><DollarSign size={18} /> Transactions</NavLink>
                <NavLink to="/finance/payouts" onClick={onClose} className={navLinkClass}><CreditCard size={18} /> Payouts</NavLink>
              </div>
            )}
          </div>

          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">System</p>
          <NavLink to="/banners" onClick={onClose} className={navLinkClass}><Image size={20} /> Banners</NavLink>
          {/* Direct link to Profile since other settings are removed */}
          <NavLink to="/settings/profile" onClick={onClose} className={navLinkClass}><Settings size={20} /> Settings</NavLink>

        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-800 bg-gray-900">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;