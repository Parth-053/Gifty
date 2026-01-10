import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal'; // Reusing Modal

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="">
      <div className="text-center pt-2">
        {/* Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4 animate-bounce">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title || "Are you sure?"}</h3>
        <p className="text-sm text-gray-500 mb-6 px-4 leading-relaxed">
          {message || "This action cannot be undone. Do you want to proceed?"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Processing..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;