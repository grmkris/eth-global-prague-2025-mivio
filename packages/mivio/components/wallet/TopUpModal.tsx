import React, { useState } from 'react';
import ModalBase from './ModalBase';
import { PASTEL_COLORS } from '../../constants';
import { CheckCircleIcon, ExclamationCircleIcon } from '../icons/NavIcons';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUpSuccess: (amount: number) => void;
  currentCurrency: string;
  isOnline: boolean;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onTopUpSuccess, currentCurrency, isOnline }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
    setError(null);
    setSuccessMessage(null);
  };

  const handleConfirmTopUp = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!isOnline) {
      setError("You are offline. Top up is currently unavailable.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      // Mock success
      onTopUpSuccess(numericAmount);
      setSuccessMessage(`Successfully topped up ${currentCurrency} ${numericAmount.toFixed(2)}!`);
      setAmount(''); // Reset amount
      setIsLoading(false);
      // Optional: auto close modal after a delay or keep it open to show success
      setTimeout(() => {
        onClose();
        setSuccessMessage(null); // Reset success message on close
      }, 2000);
    }, 1500);
  };
  
  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
      setPaymentMethod('fiat');
    }
  }, [isOpen]);


  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Top Up Balance">
      <div className="space-y-6">
        {!isOnline && (
          <div className={`p-3 rounded-lg ${PASTEL_COLORS.yellow.light} ${PASTEL_COLORS.yellow.text} text-sm flex items-center space-x-2`}>
            <ExclamationCircleIcon className="w-5 h-5"/>
            <span>You are offline. Top up functionality is disabled.</span>
          </div>
        )}

        {error && (
          <div className={`p-3 rounded-lg ${PASTEL_COLORS.blush.light} ${PASTEL_COLORS.blush.text} text-sm flex items-center space-x-2`}>
            <ExclamationCircleIcon className="w-5 h-5"/>
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className={`p-3 rounded-lg ${PASTEL_COLORS.mint.light} ${PASTEL_COLORS.mint.text} text-sm flex items-center space-x-2`}>
            <CheckCircleIcon className="w-5 h-5"/>
            <span>{successMessage}</span>
          </div>
        )}

        <div>
          <label htmlFor="topup-amount" className={`block text-sm font-medium ${PASTEL_COLORS.textDark} mb-1`}>
            Amount ({currentCurrency})
          </label>
          <input
            type="text" // Using text to manage decimal input easily
            id="topup-amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="e.g., 50.00"
            disabled={isLoading || !isOnline || !!successMessage}
            className={`w-full px-4 py-3 border ${PASTEL_COLORS.inputBorder} rounded-xl text-slate-700 placeholder-slate-400 
                        focus:outline-none focus:ring-2 ${PASTEL_COLORS.mint.border} focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:cursor-not-allowed animate-input-glow`}
          />
        </div>

        <div>
          <span className={`block text-sm font-medium ${PASTEL_COLORS.textDark} mb-2`}>Payment Method</span>
          <div className="flex space-x-3">
            <button
              onClick={() => setPaymentMethod('fiat')}
              disabled={isLoading || !isOnline || !!successMessage}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all
                ${paymentMethod === 'fiat' ? `${PASTEL_COLORS.mint.button} text-white shadow-md` : `bg-white ${PASTEL_COLORS.textLight} hover:bg-slate-50 border-slate-300`}
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Fiat (Card/Bank)
            </button>
            <button
              onClick={() => setPaymentMethod('crypto')}
              disabled={isLoading || !isOnline || !!successMessage}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all
                ${paymentMethod === 'crypto' ? `${PASTEL_COLORS.mint.button} text-white shadow-md` : `bg-white ${PASTEL_COLORS.textLight} hover:bg-slate-50 border-slate-300`}
                 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Crypto
            </button>
          </div>
        </div>

        <button
          onClick={handleConfirmTopUp}
          disabled={isLoading || !isOnline || !!successMessage || !amount}
          className={`${PASTEL_COLORS.mint.button} text-white w-full py-3.5 px-6 rounded-xl text-lg font-semibold 
                      transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-60 
                      disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                      focus:ring-offset-2 ${PASTEL_COLORS.mint.border}`}
        >
          {isLoading ? 'Processing...' : 'Confirm Top Up'}
        </button>
      </div>
      <style>{`
        .animate-input-glow:focus {
          box-shadow: 0 0 0 3px ${PASTEL_COLORS.mint.light.replace('bg-', 'rgba(').replace('-100', ',0.4)')}; /* Crude conversion to rgba for glow */
        }
      `}</style>
    </ModalBase>
  );
};

export default TopUpModal;