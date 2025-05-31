import React from 'react';
import ModalBase from '../wallet/ModalBase'; // Reusing ModalBase structure
import { PASTEL_COLORS } from '../../constants';
import { ExclamationCircleIcon } from '../icons/NavIcons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode; // Can be string or JSX for more complex messages
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string; // e.g., PASTEL_COLORS.red.button
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = PASTEL_COLORS.mint.button,
  icon
}) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {icon && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100">
            {icon}
          </div>
        )}
        <div className="text-center">
            <p className={`${PASTEL_COLORS.textDark} text-md`}>{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold 
                        transition-all duration-300 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 ${PASTEL_COLORS.mint.border}`} // Ring color can be adapted too
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className={`bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold 
                        transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 ${PASTEL_COLORS.sky.border}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default ConfirmationModal;
