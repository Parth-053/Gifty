import React, { useState } from 'react';
import { Type, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import AIGenerator from './AIGenerator';

const tabs = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'ai', label: 'AI Gen', icon: Sparkles },
  { id: 'upload', label: 'Upload', icon: Upload },
];

const ToolsPanel = ({ onAddText, onAddImage }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddImage(url);
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 h-1/2 md:h-full md:border-l md:border-t-0 flex flex-col">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2
              ${activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-5 overflow-y-auto flex-1">
        
        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Add Custom Text</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button 
                onClick={() => { onAddText(textInput); setTextInput(''); }}
                disabled={!textInput.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
              >
                Add
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
               {/* Pre-defined fonts/styles could go here */}
            </div>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <AIGenerator onImageSelect={onAddImage} />
        )}

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:bg-white group-hover:text-blue-600 shadow-sm">
                <ImageIcon size={24} />
              </div>
              <p className="text-sm font-bold text-gray-700">Click to Upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel;