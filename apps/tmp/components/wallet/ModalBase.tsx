import React from 'react';
import { XMarkIcon } from '../icons/NavIcons';
import { PASTEL_COLORS } from '../../constants';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const ModalBase: React.FC<ModalBaseProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  let maxWidthClass = 'max-w-md'; // Default medium
  if (size === 'sm') maxWidthClass = 'max-w-sm';
  if (size === 'lg') maxWidthClass = 'max-w-lg';
  
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={onClose} // Close on overlay click
    >
      <div
        className={`bg-white w-full ${maxWidthClass} rounded-t-2xl sm:rounded-2xl shadow-2xl transform animate-slideUp flex flex-col max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <header className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 id="modalTitle" className="text-xl font-semibold text-slate-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0.5; transform: translateY(100%) sm:translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) sm:translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ModalBase;