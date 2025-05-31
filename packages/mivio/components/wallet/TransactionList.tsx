import React from 'react';
import { Transaction } from '../../types';
import TransactionItemCard from './TransactionItemCard';
import { PASTEL_COLORS } from '../../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onTransactionClick }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className={`${PASTEL_COLORS.textLight}`}>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <div 
          key={tx.id} 
          className="animate-slide-in" 
          style={{ animationDelay: `${index * 100}ms`}}
        >
          <TransactionItemCard 
            transaction={tx} 
            onClick={() => onTransactionClick(tx)} 
          />
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TransactionList;