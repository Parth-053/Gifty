import React from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <ArchiveBoxXMarkIcon />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      
      {action && (
        <div className="mt-6">
          {typeof action === 'object' && action.label && action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {action.label}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;