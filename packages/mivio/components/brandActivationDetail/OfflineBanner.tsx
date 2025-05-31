import React from 'react';
import { ExclamationCircleIcon } from '../icons/NavIcons';
import { PASTEL_COLORS } from '../../constants';

interface OfflineBannerProps {
  isOnline: boolean;
  message?: string; // Optional custom message
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, message }) => {
  if (isOnline) {
    return null;
  }

  const displayMessage = message || "You're offline. Check-in will sync when connected.";
  const bgColor = message ? PASTEL_COLORS.mint.light : PASTEL_COLORS.sky.light; // Mint for wallet, Sky for general
  const textColor = message ? PASTEL_COLORS.mint.text : PASTEL_COLORS.sky.text;


  return (
    <div className={`sticky top-0 p-3 ${bgColor} text-center z-50 shadow-md animate-slideDownFadeIn`}>
      <p className={`${textColor} text-sm font-medium flex items-center justify-center`}>
        <ExclamationCircleIcon className="w-5 h-5 mr-2" />
        {displayMessage}
      </p>
      <style>{`
        @keyframes slideDownFadeIn {
          0% { opacity: 0; transform: translateY(-100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDownFadeIn { animation: slideDownFadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default OfflineBanner;