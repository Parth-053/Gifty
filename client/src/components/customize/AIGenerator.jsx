import React from 'react';
import { Wand2, Loader2 } from 'lucide-react';

const AIGenerator = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Magic Generator</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="E.g., A funny birthday gift for my programmer husband who loves coffee..."
        className="w-full mt-2 text-sm text-gray-700 placeholder-gray-300 outline-none resize-none bg-transparent"
        rows="3"
      />
      <button 
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full mt-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B6B]/20 active:scale-95 transition-transform disabled:opacity-70"
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <><Wand2 size={18} /> Generate Ideas</>}
      </button>
    </div>
  );
};

export default AIGenerator;