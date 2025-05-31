import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BADGES, PASTEL_COLORS } from '../constants';
import { BadgeItem } from '../types';
import { TrophyIcon, ChevronLeftIcon } from '../components/icons/NavIcons';

const BadgeGridItem: React.FC<{ badge: BadgeItem }> = ({ badge }) => {
  return (
    <div 
      className={`flex flex-col items-center p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 cursor-pointer
                  ${badge.isLocked ? 'bg-slate-100 filter grayscale opacity-70' : 'bg-white'}`}
      role="button"
      tabIndex={0}
      aria-label={`${badge.name}${badge.isLocked ? ' (Locked)' : ''}`}
    >
      <img 
        src={badge.iconUrl} 
        alt={badge.name} 
        className={`w-20 h-20 rounded-full mb-2 shadow-md border-2 ${badge.isLocked ? 'border-slate-300' : PASTEL_COLORS.sky.border}`}
      />
      <h3 className={`text-md font-semibold ${badge.isLocked ? PASTEL_COLORS.textLight : PASTEL_COLORS.textDark}`}>{badge.name}</h3>
      {!badge.isLocked && badge.unlockDate && (
        <p className={`text-xs ${PASTEL_COLORS.textLight}`}>{badge.unlockDate}</p>
      )}
      {badge.isLocked && (
         <p className={`text-xs ${PASTEL_COLORS.textLight}`}>Locked</p>
      )}
    </div>
  );
};


const BadgesPage: React.FC = () => {
  const unlockedBadges = MOCK_BADGES.filter(b => !b.isLocked);
  const lockedBadges = MOCK_BADGES.filter(b => b.isLocked);

  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6 sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 py-3 border-b border-slate-200 -mx-4 px-4">
        <div className="flex items-center justify-between">
            <Link to="/profile" className={`p-2 rounded-full hover:${PASTEL_COLORS.sky.light} active:bg-sky-200 transition-colors`}>
                <ChevronLeftIcon className={`w-6 h-6 ${PASTEL_COLORS.sky.text}`} />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Badge Vault</h1>
            <div className="w-10"> {/* Spacer */} </div>
        </div>
      </header>
      
      {MOCK_BADGES.length > 0 ? (
        <div className="space-y-8">
          {unlockedBadges.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
                <TrophyIcon className={`w-6 h-6 mr-2 ${PASTEL_COLORS.yellow.filled_icon}`} /> Unlocked Badges ({unlockedBadges.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {unlockedBadges.map(badge => (
                  <BadgeGridItem key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          )}

          {lockedBadges.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
                <TrophyIcon className={`w-6 h-6 mr-2 ${PASTEL_COLORS.textLight}`} /> Locked Badges ({lockedBadges.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {lockedBadges.map(badge => (
                  <BadgeGridItem key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <TrophyIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className={`${PASTEL_COLORS.textDark}`}>No badges collected yet.</p>
          <p className={`${PASTEL_COLORS.textLight} text-sm`}>Start exploring events and activations to earn them!</p>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
