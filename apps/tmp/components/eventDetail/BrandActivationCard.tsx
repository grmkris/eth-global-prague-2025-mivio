import React from 'react';
import { BrandActivation } from '../../types';
import { SparklesIcon } from '../icons/NavIcons';
import { PASTEL_COLORS } from '../../constants';

interface BrandActivationCardProps {
  activation: BrandActivation;
}

const BrandActivationCard: React.FC<BrandActivationCardProps> = ({ activation }) => {
  return (
    <div 
      className="flex-shrink-0 w-48 bg-white rounded-2xl shadow-lg p-4 mr-4 transition-all duration-300 hover:shadow-xl active:scale-[0.98] cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Activate ${activation.name}`}
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 rounded-full ${activation.themeColor} flex items-center justify-center text-xl mr-3 shadow-sm`}>
          {activation.logoUrl && activation.logoUrl.length > 2 ? <img src={activation.logoUrl} alt="" className="w-6 h-6"/> : activation.logoUrl }
        </div>
        <h4 className="text-md font-semibold text-slate-700 flex-1 truncate">{activation.name}</h4>
      </div>
      <div className={`${PASTEL_COLORS.mint.light} ${PASTEL_COLORS.mint.text} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5`}>
        <SparklesIcon className="w-4 h-4" />
        <span>{activation.xpAvailable} XP Available</span>
      </div>
    </div>
  );
};

export default BrandActivationCard;
