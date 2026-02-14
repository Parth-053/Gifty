import React from 'react';
import { SearchX } from 'lucide-react';

const NoResults = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <SearchX size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
      <p className="text-gray-500 text-sm max-w-xs mx-auto">
        We couldn't find any matches for "<span className="font-semibold text-gray-800">{query}</span>".
        <br/>Try checking your spelling or use different keywords.
      </p>
    </div>
  );
};

export default NoResults;