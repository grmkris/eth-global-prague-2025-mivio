import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons/NavIcons';
import { BrandActivation } from '../../types';
import { PASTEL_COLORS } from '../../constants';

interface BrandActivationHeaderProps {
  activation: BrandActivation;
}

const BrandActivationHeader: React.FC<BrandActivationHeaderProps> = ({ activation }) => {
  const navigate = useNavigate();

  // Choose a pastel color for the icon background, maybe from activation.themeColor or a default
  const iconBgColor = activation.themeColor || PASTEL_COLORS.sky.light;
  const iconTextColor = PASTEL_COLORS.sky.text; // Or derive from themeColor

  return (
    <header className="p-4 sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-full hover:${PASTEL_COLORS.mint.light} active:bg-green-200 transition-colors`}
          aria-label="Go back"
        >
          <ChevronLeftIcon className={`w-6 h-6 ${PASTEL_COLORS.mint.text}`} />
        </button>
        <div className="flex-1 text-center flex items-center justify-center space-x-2">
          {activation.logoUrl && (
            <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center text-lg shadow-sm`}>
              {activation.logoUrl.length > 2 ? <img src={activation.logoUrl} alt="" className="w-5 h-5"/> : 
              <span className={iconTextColor}>{activation.logoUrl}</span>}
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-800 truncate">{activation.name}</h1>
        </div>
        <div className="w-10"> {/* Spacer to balance the back button */}</div>
      </div>
    </header>
  );
};

export default BrandActivationHeader;