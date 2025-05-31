import React from 'react';
import ModalBase from '../wallet/ModalBase'; // Reusing ModalBase structure
import { BadgeItem } from '../../types';
import { PASTEL_COLORS } from '../../constants';
import { TrophyIcon } from '../icons/NavIcons';

interface BadgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: BadgeItem | null;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ isOpen, onClose, badge }) => {
  if (!badge) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Badge Details" size="sm">
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center">
          <img 
            src={badge.iconUrl} 
            alt={badge.name} 
            className={`w-28 h-28 rounded-full mb-4 shadow-lg border-4 ${badge.isLocked ? 'border-slate-300 filter grayscale' : PASTEL_COLORS.sky.border}`}
          />
          <h2 className={`text-2xl font-bold ${badge.isLocked ? PASTEL_COLORS.textLight : PASTEL_COLORS.textDark}`}>
            {badge.name}
          </h2>
          {badge.isLocked ? (
            <p className={`${PASTEL_COLORS.red.text} text-sm font-medium`}>Locked</p>
          ) : (
            badge.unlockDate && <p className={`${PASTEL_COLORS.mint.text} text-sm font-medium`}>{badge.unlockDate}</p>
          )}
        </div>

        <p className={`${PASTEL_COLORS.textLight} text-md`}>
          {badge.description}
        </p>
        
        {badge.isLocked && (
             <div className={`${PASTEL_COLORS.yellow.light} p-3 rounded-lg text-sm ${PASTEL_COLORS.yellow.text}`}>
                {badge.howToEarn ? (
                  <>
                    <strong>How to unlock:</strong> {badge.howToEarn}
                  </>
                ) : (
                  "Keep exploring and completing quests to unlock this badge!"
                )}
            </div>
        )}

        <button
          onClick={onClose}
          className={`${PASTEL_COLORS.sky.button} text-white w-full py-3 px-6 rounded-xl text-md font-semibold 
                      transition-all duration-300 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 ${PASTEL_COLORS.sky.border}`}
        >
          Close
        </button>
      </div>
    </ModalBase>
  );
};

export default BadgeDetailModal;