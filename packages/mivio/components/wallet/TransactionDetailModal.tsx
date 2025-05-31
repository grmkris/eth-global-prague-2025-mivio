import React from 'react';
import ModalBase from './ModalBase';
import { Transaction } from '../../types';
import { PASTEL_COLORS } from '../../constants';
import { getTransactionIcon } from './TransactionItemCard'; // Import helper

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="py-2.5 border-b border-slate-100 last:border-b-0">
    <p className={`text-xs ${PASTEL_COLORS.textLight}`}>{label}</p>
    <p className={`text-sm font-medium ${PASTEL_COLORS.textDark}`}>{value || 'N/A'}</p>
  </div>
);

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const amountColor = transaction.amount > 0 ? PASTEL_COLORS.mint.text : PASTEL_COLORS.blush.text;
  const amountPrefix = transaction.amount > 0 ? '+' : '';

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Transaction Details" size="sm">
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center py-4">
          <div className={`p-4 rounded-full ${transaction.accentColor} mb-4 shadow-md`}>
            {getTransactionIcon(transaction.iconName, `w-10 h-10 ${PASTEL_COLORS.textDark} opacity-80`)}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{transaction.description}</h3>
          <p className={`text-3xl font-bold ${amountColor}`}>
            {amountPrefix}{transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl space-y-1">
          <DetailRow label="Date & Time" value={transaction.date} />
          <DetailRow label="Type" value={transaction.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
          {transaction.merchantOrRecipient && <DetailRow label={transaction.type === 'top-up' ? 'Source' : (transaction.type === 'send' || transaction.type === 'receive' ? (transaction.amount > 0 ? 'Sender' : 'Recipient') : 'Merchant')} value={transaction.merchantOrRecipient} />}
          <DetailRow label="Status" value={transaction.status ? transaction.status.replace(/\b\w/g, l => l.toUpperCase()) : 'Completed'} />
          <DetailRow label="Transaction ID" value={transaction.id} />
        </div>
        
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

export default TransactionDetailModal;