import React from 'react';
import { ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const CustomizeHeader = ({ onReset, onSave, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight">Customize Gift</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Design it your way using AI.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold flex items-center gap-1"
        >
          <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
        </button>
        <Button 
          onClick={onSave} 
          isLoading={loading}
          size="sm"
          className="shadow-blue-200"
        >
          <Check size={16} className="mr-1" /> Done
        </Button>
      </div>
    </div>
  );
};

export default CustomizeHeader;