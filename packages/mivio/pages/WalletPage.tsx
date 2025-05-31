import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_USER, MOCK_TRANSACTIONS, PASTEL_COLORS, UNREAD_NOTIFICATIONS_COUNT } from '../constants';
import { User, Transaction, TransactionType } from '../types';
import OfflineBanner from '../components/brandActivationDetail/OfflineBanner'; // Reusable with new message
import Toast, { ToastMessage } from '../components/brandActivationDetail/Toast';
import WalletBalanceCard from '../components/wallet/WalletBalanceCard';
import TransactionList from '../components/wallet/TransactionList';
import TopUpModal from '../components/wallet/TopUpModal';
import SendModal from '../components/wallet/SendModal';
import TransactionDetailModal from '../components/wallet/TransactionDetailModal';
import { BellIcon } from '../components/icons/NavIcons'; // For optional header notification

const WalletPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [pageKey, setPageKey] = useState(Date.now()); // Used to force re-render for animations

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setToast({id: 'online-toast', type: 'info', message: 'You are back online.'})};
    const handleOffline = () => { setIsOnline(false); setToast({id: 'offline-toast', type: 'info', message: 'You are offline. Some features may be limited.'})};

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ id: Date.now().toString(), type, message });
  };

  const dismissToast = (id: string) => {
    if (toast && toast.id === id) {
      setToast(null);
    }
  };

  const handleTopUpSuccess = (amount: number) => {
    setCurrentUser(prev => ({ ...prev, balance: prev.balance + amount }));
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'top-up',
      description: 'Top Up',
      amount: amount,
      currency: currentUser.currency,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      iconName: 'ArrowUpCircleIcon',
      accentColor: PASTEL_COLORS.mint.light,
      status: 'completed',
      merchantOrRecipient: 'Self'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    showToast('success', `Topped up ${currentUser.currency} ${amount.toFixed(2)}`);
    setPageKey(Date.now()); // Trigger animation for transaction list
  };

  const handleSendSuccess = (amount: number, recipient: string) => {
    setCurrentUser(prev => ({ ...prev, balance: prev.balance - amount }));
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'send',
      description: `Sent to ${recipient}`,
      amount: -amount,
      currency: currentUser.currency,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      iconName: 'PaperAirplaneIcon',
      accentColor: PASTEL_COLORS.lavender.light,
      status: 'completed',
      merchantOrRecipient: recipient
    };
    setTransactions(prev => [newTransaction, ...prev]);
    showToast('success', `Sent ${currentUser.currency} ${amount.toFixed(2)} to ${recipient}`);
     setPageKey(Date.now()); // Trigger animation for transaction list
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };
  
  // Update MOCK_USER's transactions to reflect the most recent one on the card
  useEffect(() => {
    if (transactions.length > 0) {
      setCurrentUser(prev => ({
        ...prev,
        transactions: [transactions[0]]
      }));
    }
  }, [transactions]);


  return (
    <div className="flex flex-col min-h-screen bg-slate-50" key={pageKey}>
      <OfflineBanner isOnline={isOnline} /> {/* Shows custom message if offline via props or internal logic */}
      
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Your Wallet</h1>
        <button className="relative p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
          <BellIcon className="w-6 h-6 text-slate-600" />
          {UNREAD_NOTIFICATIONS_COUNT > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      </header>

      <main className="flex-grow flex flex-col p-4 space-y-6 overflow-y-auto pb-24">
        {/* Wallet Balance Card - should stretch */}
        <div className="flex-grow flex flex-col min-h-[250px]"> {/* Ensure parent allows stretching */}
          <WalletBalanceCard 
            user={currentUser} 
            onTopUpClick={() => setIsTopUpModalOpen(true)}
            onSendClick={() => setIsSendModalOpen(true)}
            isOnline={isOnline}
          />
        </div>

        {/* Last Transactions Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4 px-1">Last Transactions</h2>
          <TransactionList 
            transactions={transactions} 
            onTransactionClick={handleTransactionClick} 
          />
        </section>
      </main>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onTopUpSuccess={handleTopUpSuccess}
        currentCurrency={currentUser.currency}
        isOnline={isOnline}
      />
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSendSuccess={handleSendSuccess}
        currentUser={currentUser}
        isOnline={isOnline}
      />
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
      {/* BottomNavigationBar is rendered by App.tsx */}
    </div>
  );
};

export default WalletPage;