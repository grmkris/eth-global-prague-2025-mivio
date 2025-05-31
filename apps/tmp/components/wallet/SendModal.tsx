import React, { useState, useEffect } from 'react';
import ModalBase from './ModalBase';
import { PASTEL_COLORS } from '../../constants';
import { ExclamationCircleIcon, CheckCircleIcon, PaperAirplaneIcon } from '../icons/NavIcons';
import { User } from '../../types';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (amount: number, recipient: string) => void;
  currentUser: User;
  isOnline: boolean;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, onSendSuccess, currentUser, isOnline }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setRecipient('');
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
    setError(null);
    setSuccessMessage(null);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
    setError(null);
    setSuccessMessage(null);
  };

  const handleConfirmSend = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!recipient.trim()) {
      setError("Please enter a recipient.");
      return;
    }
    if (numericAmount > currentUser.balance) {
      setError("Insufficient balance.");
      // Could add a little shake animation to the balance display here too
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simulate API call or P2P action
    setTimeout(() => {
      onSendSuccess(numericAmount, recipient);
      setSuccessMessage(`Successfully sent ${currentUser.currency} ${numericAmount.toFixed(2)} to ${recipient}!`);
      setAmount('');
      setRecipient('');
      setIsLoading(false);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);
    }, 1500);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={isOnline ? "Send Funds" : "Peer-to-Peer Payment"}>
      <div className="space-y-6">
        {!isOnline && (
          <div className={`p-3 rounded-lg ${PASTEL_COLORS.mint.light} ${PASTEL_COLORS.mint.text} text-sm flex items-center space-x-2`}>
            <PaperAirplaneIcon className="w-5 h-5"/>
            <span>You are offline. Creating a P2P payment request. Ensure the recipient can scan or receive it.</span>
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
          <label htmlFor="send-recipient" className={`block text-sm font-medium ${PASTEL_COLORS.textDark} mb-1`}>
            Recipient (Name, Username, or Address)
          </label>
          <input
            type="text"
            id="send-recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="e.g., @anna or 0x123..."
            disabled={isLoading || !!successMessage}
            className={`w-full px-4 py-3 border ${PASTEL_COLORS.inputBorder} rounded-xl text-slate-700 placeholder-slate-400 
                        focus:outline-none focus:ring-2 ${PASTEL_COLORS.lavender.border} focus:border-transparent transition-shadow disabled:bg-slate-50`}
          />
        </div>

        <div>
          <label htmlFor="send-amount" className={`block text-sm font-medium ${PASTEL_COLORS.textDark} mb-1`}>
            Amount ({currentUser.currency})
          </label>
          <input
            type="text"
            id="send-amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Max: ${currentUser.balance.toFixed(2)}`}
            disabled={isLoading || !!successMessage}
            className={`w-full px-4 py-3 border ${PASTEL_COLORS.inputBorder} rounded-xl text-slate-700 placeholder-slate-400 
                        focus:outline-none focus:ring-2 ${PASTEL_COLORS.lavender.border} focus:border-transparent transition-shadow disabled:bg-slate-50`}
          />
           <p className={`text-xs ${PASTEL_COLORS.textLight} mt-1`}>Your balance: {currentUser.currency} {currentUser.balance.toFixed(2)}</p>
        </div>

        <button
          onClick={handleConfirmSend}
          disabled={isLoading || !!successMessage || !amount || !recipient}
          className={`${PASTEL_COLORS.lavender.button} text-white w-full py-3.5 px-6 rounded-xl text-lg font-semibold 
                      transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-60 
                      disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                      focus:ring-offset-2 ${PASTEL_COLORS.lavender.border}`}
        >
          {isLoading ? 'Processing...' : (isOnline ? 'Confirm Send' : 'Create P2P Request')}
        </button>
      </div>
    </ModalBase>
  );
};

export default SendModal;