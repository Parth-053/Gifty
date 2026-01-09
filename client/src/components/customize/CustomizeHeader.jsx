import React from 'react';
import { ArrowLeft, Wand2 } from 'lucide-react';

const CustomizeHeader = ({ step, onBack }) => {
  return (
    <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
      {step === 2 && (
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
      )}
      
      <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        {step === 1 ? (
          <><Wand2 size={20} className="text-[#FF6B6B]" /> AI Gift Studio</>
        ) : (
          'Customize It'
        )}
      </h1>
      
      <div className="w-8"></div> {/* Spacer for alignment */}
    </div>
  );
};

export default CustomizeHeader;