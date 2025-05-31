import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { PASTEL_COLORS } from '../../constants';
import { CheckCircleIcon, ExclamationCircleIcon } from '../icons/NavIcons';

interface EventUnlockSectionProps {
  event: Event;
  onUnlockSuccess: () => void; // Callback when event is successfully unlocked
}

const EventUnlockSection: React.FC<EventUnlockSectionProps> = ({ event, onUnlockSuccess }) => {
  const [isUnlocked, setIsUnlocked] = useState(event.isUnlockedByUser || false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUnlockAttempt = () => {
    if (!isOnline) {
      setError("You're offline. Event unlock unavailable.");
      return;
    }
    if (!inputValue.trim()) {
      setError("Please enter your ticket e-mail or code.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Mock API call
    setTimeout(() => {
      // Mock validation: accept any non-empty input for demo
      if (inputValue.trim()) { 
        setIsUnlocked(true);
        setShowSuccess(true);
        onUnlockSuccess(); // Notify parent
        setTimeout(() => setShowSuccess(false), 2500); // Hide success message after a bit
      } else {
        setError("Invalid ticket e-mail or code. Please try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  if (isUnlocked) {
    return (
      <div className="p-5 rounded-2xl shadow-lg bg-white text-center">
        {showSuccess && (
          <div className={`mb-4 p-3 rounded-xl ${PASTEL_COLORS.mint.light} flex items-center justify-center space-x-2 animate-fadeIn`}>
            <CheckCircleIcon className={`w-6 h-6 ${PASTEL_COLORS.mint.text}`} />
            <span className={`${PASTEL_COLORS.mint.text} font-medium`}>Event Unlocked! Welcome!</span>
          </div>
        )}
        <button 
          className={`${PASTEL_COLORS.mint.button} text-white w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:opacity-90 active:scale-95 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400`}
          style={{animation: showSuccess ? 'gentleBounceIn 0.5s ease-out 0.2s both' : 'none'}}
        >
          Enter Event
        </button>
        <p className={`mt-3 text-sm ${PASTEL_COLORS.textLight}`}>Your access is confirmed!</p>
        <style>{`
          @keyframes gentleBounceIn {
            0% { opacity: 0; transform: scale(0.8); }
            70% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl shadow-lg bg-white">
      {!isOnline && (
        <div className={`mb-4 p-3 rounded-xl ${PASTEL_COLORS.sky.light} text-center ${PASTEL_COLORS.sky.text}`}>
          You’re offline—event unlock unavailable, but you can browse info.
        </div>
      )}
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Unlock with Ticket</h2>
      <p className={`text-sm ${PASTEL_COLORS.textLight} mb-4`}>Enter your ticket e-mail or code below.</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => { setInputValue(e.target.value); setError(null); }}
        placeholder="Email or Code"
        disabled={!isOnline || isLoading}
        className={`w-full px-4 py-3 mb-3 border ${PASTEL_COLORS.inputBorder} rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none transition-shadow`}
      />
      {error && (
        <p className={`text-sm ${PASTEL_COLORS.error} mb-3 flex items-center`}>
          <ExclamationCircleIcon className="w-5 h-5 mr-1" /> {error}
        </p>
      )}
      <button
        onClick={handleUnlockAttempt}
        disabled={!isOnline || isLoading}
        className={`${PASTEL_COLORS.lavender.button} text-white w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400`}
      >
        {isLoading ? 'Unlocking...' : 'Unlock Event'}
      </button>
    </div>
  );
};

export default EventUnlockSection;
