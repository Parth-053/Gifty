import React, { useState } from 'react';
import { Sparkles, Loader2, ImagePlus } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AIGenerator = ({ onImageSelect }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setGeneratedImages([]); // Clear previous

    try {
      // API call to your backend AI route
      const response = await api.post('/ai/generate', { prompt });
      // Assuming backend returns { data: [url1, url2] } or single url
      const images = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      setGeneratedImages(images);
      toast.success("Design generated!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-purple-600" /> AI Magic Generator
        </h3>
        <p className="text-xs text-gray-500 mb-3">Describe what you want (e.g., "Cute astronaut cat in space")</p>
        
        <form onSubmit={handleGenerate} className="flex flex-col gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your imagination here..."
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none resize-none h-20"
          />
          <button 
            type="submit" 
            disabled={loading || !prompt}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={14} /> Generate Design</>}
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {generatedImages.map((url, idx) => (
            <button 
              key={idx}
              onClick={() => onImageSelect(url)}
              className="relative aspect-square rounded-lg overflow-hidden group border-2 border-transparent hover:border-blue-500 transition-all"
            >
              <img src={url} alt="Generated" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold flex items-center gap-1">
                  <ImagePlus size={14} /> Use This
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIGenerator;