import React from 'react';
import { Transaction } from '../../types';
import { PASTEL_COLORS } from '../../constants';
import { 
  ArrowUpCircleIcon, 
  CoffeeIcon, 
  ShoppingBagIcon, 
  PaperAirplaneIcon, 
  ArrowDownCircleIcon,
  QuestionMarkCircleIcon
} from '../icons/NavIcons';

interface TransactionItemCardProps {
  transaction: Transaction;
  onClick: () => void;
}

const getTransactionIcon = (iconName: Transaction['iconName'], className?: string) => {
  const props = { className: className || "w-6 h-6" };
  switch (iconName) {
    case 'ArrowUpCircleIcon': return <ArrowUpCircleIcon {...props} />;
    case 'CoffeeIcon': return <CoffeeIcon {...props} />;
    case 'ShoppingBagIcon': return <ShoppingBagIcon {...props} />;
    case 'PaperAirplaneIcon': return <PaperAirplaneIcon {...props} />;
    case 'ArrowDownCircleIcon': return <ArrowDownCircleIcon {...props} />;
    default: return <QuestionMarkCircleIcon {...props} />;
  }
};

const TransactionItemCard: React.FC<TransactionItemCardProps> = ({ transaction, onClick }) => {
  const amountColor = transaction.amount > 0 ? PASTEL_COLORS.mint.text : PASTEL_COLORS.blush.text;
  const amountPrefix = transaction.amount > 0 ? '+' : '';

  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl shadow-lg mb-3 transition-all duration-300 hover:shadow-xl active:scale-[0.99] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
      aria-label={`View details for transaction: ${transaction.description}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2.5 rounded-full ${transaction.accentColor} flex items-center justify-center shadow-sm`}>
          {getTransactionIcon(transaction.iconName, `w-6 h-6 ${PASTEL_COLORS.textDark} opacity-70`)}
        </div>
        <div className="flex-1 min-w-0"> {/* Added min-w-0 for truncation */}
          <p className="text-md font-semibold text-slate-800 truncate">{transaction.description}</p>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>{transaction.date}</p>
        </div>
        <div className={`text-md font-semibold ${amountColor} whitespace-nowrap`}>
          {amountPrefix}{transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
        </div>
      </div>
    </button>
  );
};

export { getTransactionIcon };
export default TransactionItemCard;