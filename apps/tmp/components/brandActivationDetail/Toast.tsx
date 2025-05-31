import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '../icons/NavIcons';
import { PASTEL_COLORS } from '../../constants';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) {
    return null;
  }

  let bgColor = PASTEL_COLORS.sky.light;
  let textColor = PASTEL_COLORS.sky.text;
  let IconComponent = InformationCircleIcon; // Renamed to avoid conflict with imported Icon

  switch (toast.type) {
    case 'success':
      bgColor = PASTEL_COLORS.mint.light;
      textColor = PASTEL_COLORS.mint.text;
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      bgColor = PASTEL_COLORS.blush.light; // Using blush for error as red-500 is not pastel
      textColor = PASTEL_COLORS.blush.text;
      IconComponent = XCircleIcon;
      break;
    case 'info': // Fallthrough default
    default:
      IconComponent = InformationCircleIcon; 
      break;
  }


  return (
    <div 
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-2xl ${bgColor} ${textColor} flex items-center space-x-3 max-w-md w-[90%] z-[60] animate-toastIn`}
        role="alert"
    >
      <IconComponent className="w-6 h-6 flex-shrink-0" />
      <span className="flex-grow text-sm font-medium">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="p-1 rounded-full hover:bg-black/10" aria-label="Dismiss toast">
        <XMarkIcon className="w-4 h-4" />
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-toastIn { animation: toastIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Toast;