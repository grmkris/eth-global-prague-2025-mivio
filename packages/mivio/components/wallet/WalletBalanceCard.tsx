import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../../types';
import { PASTEL_COLORS } from '../../constants';
import { PlusCircleIcon, PaperAirplaneIcon, ArrowUpCircleIcon } from '../icons/NavIcons'; // Assuming icons exist

interface WalletBalanceCardProps {
  user: User;
  onTopUpClick: () => void;
  onSendClick: () => void;
  isOnline: boolean;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ user, onTopUpClick, onSendClick, isOnline }) => {
  const mostRecentTransaction = user.transactions && user.transactions.length > 0 ? user.transactions[0] : null;
  const [balanceDisplay, setBalanceDisplay] = useState(user.balance.toFixed(2));
  const [plusButtonAnimation, setPlusButtonAnimation] = useState('');

  useEffect(() => {
    // Animate balance update
    const newBalance = user.balance.toFixed(2);
    if (balanceDisplay !== newBalance) {
      // Basic "animation" by changing the value; more complex number counting can be added
      setBalanceDisplay(newBalance);
    }
  }, [user.balance, balanceDisplay]);
  
  const handlePlusButtonClick = () => {
    if (!isOnline) return;
    setPlusButtonAnimation('animate-button-pop');
    setTimeout(() => setPlusButtonAnimation(''), 300); // Reset animation
    onTopUpClick();
  };

  return (
    <div className={`relative p-6 rounded-2xl shadow-xl flex flex-col ${PASTEL_COLORS.mint.light} border ${PASTEL_COLORS.mint.border} min-h-[200px] h-full`}> {/* Ensure it can grow */}
      <button 
        onClick={handlePlusButtonClick}
        disabled={!isOnline}
        className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors group ${plusButtonAnimation}
                    ${!isOnline ? 'opacity-50 cursor-not-allowed' : `${PASTEL_COLORS.mint.button} text-white hover:opacity-90 active:scale-95`}`}
        aria-label="Top up balance"
      >
        <PlusCircleIcon className="w-8 h-8" />
      </button>

      <div className="mb-1">
        <p className={`text-sm ${PASTEL_COLORS.mint.text}`}>Balance</p>
        <h2 className={`text-4xl font-bold ${PASTEL_COLORS.textDark} transition-all duration-500`}>
          {user.currency} <span className="tabular-nums">{balanceDisplay}</span>
        </h2>
      </div>

      {mostRecentTransaction && (
        <p className={`text-xs ${PASTEL_COLORS.textLight} mb-6 truncate`}>
          {mostRecentTransaction.description} ({mostRecentTransaction.amount > 0 ? '+' : ''}{mostRecentTransaction.currency} {mostRecentTransaction.amount.toFixed(2)})
        </p>
      )}
      {!mostRecentTransaction && (
         <p className={`text-xs ${PASTEL_COLORS.textLight} mb-6`}>No recent transactions.</p>
      )}


      <div className="mt-auto flex space-x-3"> {/* Pushes buttons to bottom */}
        <button
          onClick={onTopUpClick}
          disabled={!isOnline}
          className={`${PASTEL_COLORS.mint.button} text-white flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <ArrowUpCircleIcon className="w-5 h-5" />
          <span>Top Up</span>
        </button>
        <button
          onClick={onSendClick}
          // No disabled state for Send for P2P offline
          className={`${PASTEL_COLORS.lavender.button} text-white flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 hover:shadow-lg`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          <span>{isOnline ? 'Send' : 'P2P Pay'}</span>
        </button>
      </div>
      <style>{`
        @keyframes buttonPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2) rotate(15deg); }
          100% { transform: scale(1); }
        }
        .animate-button-pop { animation: buttonPop 0.3s ease-out; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
};

export default WalletBalanceCard;