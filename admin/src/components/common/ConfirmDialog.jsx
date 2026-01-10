import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="">
      <div className="text-center sm:text-left">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-bold leading-6 text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;