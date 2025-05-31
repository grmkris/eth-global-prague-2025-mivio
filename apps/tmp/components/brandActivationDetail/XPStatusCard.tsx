import React from 'react';
import { FlameIcon, CheckIcon, SoulboundNFEstagio1Icon, SoulboundNFEstagio2Icon, SoulboundNFEstagio3Icon } from '../icons/NavIcons';
import { PASTEL_COLORS } from '../../constants';

interface XPStatusCardProps {
  xpAvailableForCheckIn: number;
  currentXPInActivation: number;
  totalXPInActivation: number;
  questTitle: string;
  questCurrentProgress: number;
  questTargetProgress: number;
  isQuestCompleted: boolean;
  dailyStreak: number;
  soulboundNftLevel: 1 | 2 | 3; // Simplified level for NFT visual
}

const XPStatusCard: React.FC<XPStatusCardProps> = ({
  xpAvailableForCheckIn,
  currentXPInActivation,
  totalXPInActivation,
  questTitle,
  questCurrentProgress,
  questTargetProgress,
  isQuestCompleted,
  dailyStreak,
  soulboundNftLevel
}) => {
  const progressPercentage = totalXPInActivation > 0 ? (currentXPInActivation / totalXPInActivation) * 100 : 0;

  let NftIconComponent;
  switch (soulboundNftLevel) {
    case 1: NftIconComponent = SoulboundNFEstagio1Icon; break;
    case 2: NftIconComponent = SoulboundNFEstagio2Icon; break;
    case 3: NftIconComponent = SoulboundNFEstagio3Icon; break;
    default: NftIconComponent = SoulboundNFEstagio1Icon;
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg space-y-5">
      {/* XP Available from this interaction */}
      <div className={`${PASTEL_COLORS.mint.light} p-4 rounded-xl text-center`}>
        <p className={`text-3xl font-bold ${PASTEL_COLORS.mint.text}`}>+{xpAvailableForCheckIn} XP</p>
        <p className={`text-sm ${PASTEL_COLORS.mint.text}`}>Available from this Check-In</p>
      </div>

      {/* XP Progress for this activation */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-slate-600">XP from this Activation</h3>
          <p className="text-sm font-semibold text-slate-700">{currentXPInActivation.toLocaleString()} / {totalXPInActivation.toLocaleString()}</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`${PASTEL_COLORS.mint.button} h-3 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label={`XP progress for this activation: ${currentXPInActivation} of ${totalXPInActivation}`}
          />
        </div>
      </div>

      {/* Current Quest */}
      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-medium text-slate-600 mb-1">Current Quest</h3>
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>{questTitle} ({questCurrentProgress}/{questTargetProgress})</span>
          {isQuestCompleted && <CheckIcon className={`w-5 h-5 ${PASTEL_COLORS.mint.text}`} />}
        </div>
      </div>
      
      {/* Daily Streak & Soulbound NFT */}
      <div className="flex justify-between items-center border-t border-slate-200 pt-4">
        <div className="flex items-center space-x-2 text-sm">
          <FlameIcon className="w-6 h-6 text-orange-500 animate-pulse-streak" />
          <span className="text-slate-700 font-medium">{dailyStreak} day streak</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
           <div className="w-12 h-12 relative">
            <NftIconComponent className="w-full h-full text-purple-500 opacity-80" />
            <div className="absolute inset-0 bg-white/10 animate-nft-shine"></div>
           </div>
          <p className="text-xs text-slate-500">Soulbound NFT</p>
        </div>
      </div>
      <style>{`
        @keyframes pulseStreak {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-streak { animation: pulseStreak 2s infinite ease-in-out; }

        @keyframes nftShine {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          30% { transform: translateX(-100%) skewX(-20deg); opacity: 0.3; }
          70% { transform: translateX(100%) skewX(-20deg); opacity: 0.3; }
          100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
        }
        .animate-nft-shine {
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
          animation: nftShine 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default XPStatusCard;