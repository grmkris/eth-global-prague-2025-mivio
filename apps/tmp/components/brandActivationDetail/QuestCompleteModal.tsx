import React from 'react';
import { BadgeItem } from '../../types';
import { CheckCircleIcon, XMarkIcon } from '../icons/NavIcons'; // Assuming XMarkIcon exists or is added
import { PASTEL_COLORS } from '../../constants';

interface QuestCompleteModalProps {
  badge: BadgeItem;
  onClose: () => void;
}

const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({ badge, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="questCompleteTitle"
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center transform animate-slideUp">
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close quest completion modal"
        >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
        </button>

        <CheckCircleIcon className={`w-16 h-16 ${PASTEL_COLORS.mint.text} mx-auto mb-4`} />
        <h2 id="questCompleteTitle" className="text-2xl font-bold text-slate-800 mb-2">Quest Complete!</h2>
        <p className={`${PASTEL_COLORS.textDark} mb-4`}>You've unlocked a new badge:</p>
        
        <div className="bg-slate-50 p-4 rounded-xl mb-6 flex flex-col items-center space-y-2">
          <img src={badge.iconUrl} alt={badge.name} className="w-20 h-20 rounded-full shadow-md border-2 border-white" />
          <h3 className="text-lg font-semibold text-slate-700">{badge.name}</h3>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>{badge.description}</p>
        </div>

        <button
          onClick={onClose}
          className={`${PASTEL_COLORS.mint.button} text-white w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:opacity-90 active:scale-95`}
        >
          Awesome!
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QuestCompleteModal;