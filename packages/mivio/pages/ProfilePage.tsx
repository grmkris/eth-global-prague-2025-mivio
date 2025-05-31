import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER, MOCK_BADGES, MOCK_PROFILE_SETTINGS, MOCK_NOTIFICATIONS, PASTEL_COLORS, UNREAD_NOTIFICATIONS_COUNT } from '../constants';
import { User, BadgeItem, ProfileSettings, NotificationItem as NotificationType } from '../types';
import OfflineBanner from '../components/brandActivationDetail/OfflineBanner';
import Toast, { ToastMessage } from '../components/brandActivationDetail/Toast';
import SwitchToggle from '../components/profile/SwitchToggle';
import BadgeDetailModal from '../components/modals/BadgeDetailModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { getTransactionIcon } from '../components/wallet/TransactionItemCard'; // For notification icons

import { 
    PencilIcon, 
    ClipboardDocumentIcon, 
    BellIcon, 
    ChevronRightIcon, 
    ExclamationCircleIcon,
    CheckCircleIcon,
    SparklesIcon // For quest notifications if needed
} from '../components/icons/NavIcons';

// --- Helper: Truncate Wallet Address ---
const truncateWalletAddress = (address: string, startChars = 6, endChars = 4) => {
  if (!address) return '';
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

// --- Component: ProfileInfoCard ---
interface ProfileInfoCardProps {
  user: User;
  onEdit: () => void;
  onCopyAddress: () => void;
  isOnline: boolean;
}
const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user, onEdit, onCopyAddress, isOnline }) => {
  const [avatarClicked, setAvatarClicked] = useState(false);

  const handleAvatarClick = () => {
    setAvatarClicked(true);
    setTimeout(() => setAvatarClicked(false), 300); // Animation duration
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg relative text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className={`w-24 h-24 rounded-full shadow-md border-4 border-white cursor-pointer transition-transform duration-300 ${avatarClicked ? 'animate-avatar-bounce' : ''}`}
          onClick={handleAvatarClick}
          aria-label="Profile avatar, tap to bounce"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className={`${PASTEL_COLORS.textLight} text-sm`}>{user.email}</p>
          {user.walletAddress && (
            <button 
              onClick={onCopyAddress}
              disabled={!isOnline}
              className={`mt-1 inline-flex items-center space-x-1.5 ${PASTEL_COLORS.sky.text} hover:text-sky-600 active:text-sky-700 transition-colors text-xs group disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Copy wallet address"
            >
              <ClipboardDocumentIcon className="w-4 h-4 group-hover:animate-pulse-once" />
              <span>{truncateWalletAddress(user.walletAddress)}</span>
            </button>
          )}
        </div>
        <button 
          onClick={onEdit} 
          disabled={!isOnline}
          className={`p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors absolute top-4 right-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Edit profile"
        >
          <PencilIcon className="w-5 h-5 text-slate-500" />
        </button>
      </div>
      <style>{`
        @keyframes avatarBounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-5px); }
        }
        .animate-avatar-bounce { animation: avatarBounce 0.3s ease-out; }
        @keyframes pulseOnce {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .animate-pulse-once { animation: pulseOnce 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

// --- Component: NotificationPreferencesSection ---
interface NotificationPreferencesProps {
  settings: ProfileSettings;
  onToggle: (key: keyof ProfileSettings) => void;
  isOnline: boolean;
}
const NotificationPreferencesSection: React.FC<NotificationPreferencesProps> = ({ settings, onToggle, isOnline }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-700 mb-2">Notifications & Preferences</h3>
      <div className="divide-y divide-slate-100">
        <SwitchToggle
          id="appNotifications"
          label="App Notifications"
          checked={settings.appNotifications}
          onChange={() => onToggle('appNotifications')}
          disabled={!isOnline}
          accentColorClass={PASTEL_COLORS.lavender.button}
        />
        <SwitchToggle
          id="emailUpdates"
          label="Email Updates"
          checked={settings.emailUpdates}
          onChange={() => onToggle('emailUpdates')}
          disabled={!isOnline}
          accentColorClass={PASTEL_COLORS.lavender.button}
        />
        <SwitchToggle
          id="eventReminders"
          label="Event Reminders"
          checked={settings.eventReminders}
          onChange={() => onToggle('eventReminders')}
          disabled={!isOnline}
          accentColorClass={PASTEL_COLORS.lavender.button}
        />
      </div>
    </div>
  );
};

// --- Component: RecentBadgesSection ---
interface RecentBadgesProps {
  badges: BadgeItem[];
  onViewBadge: (badge: BadgeItem) => void;
  onViewAll: () => void;
}
const RecentBadgesSection: React.FC<RecentBadgesProps> = ({ badges, onViewBadge, onViewAll }) => {
  const displayedBadges = badges.slice(0, 4); // Show up to 4 recent
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-700">Recent Badges</h3>
        <Link to="/badges" onClick={onViewAll} className={`text-sm ${PASTEL_COLORS.lavender.text} font-medium hover:underline flex items-center`}>
          View All <ChevronRightIcon className="w-4 h-4 ml-0.5" />
        </Link>
      </div>
      {displayedBadges.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayedBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => onViewBadge(badge)}
              className={`flex-shrink-0 flex flex-col items-center space-y-1 group p-2 rounded-lg hover:bg-slate-50 active:scale-90 transition-transform w-20 ${badge.isLocked ? 'filter grayscale opacity-70' : ''}`}
              aria-label={`View badge: ${badge.name}`}
            >
              <img src={badge.iconUrl} alt={badge.name} className="w-14 h-14 rounded-full shadow-sm border-2 border-white group-hover:scale-105 transition-transform" />
              <p className={`text-xs ${PASTEL_COLORS.textLight} group-hover:text-slate-700 truncate w-full text-center`}>{badge.name}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className={`${PASTEL_COLORS.textLight} text-sm`}>No badges earned yet. Start exploring!</p>
      )}
    </div>
  );
};

// --- Component: AccountActionsSection ---
interface AccountActionsProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
  isOnline: boolean;
}
const AccountActionsSection: React.FC<AccountActionsProps> = ({ onExportData, onDeleteAccount, isOnline }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Account & Data</h3>
      <div className="space-y-3">
        <button
          onClick={onExportData}
          disabled={!isOnline}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                      ${PASTEL_COLORS.sky.light} ${PASTEL_COLORS.sky.text} hover:opacity-90 border ${PASTEL_COLORS.sky.border}`}
        >
          Export Data
        </button>
        <button
          onClick={onDeleteAccount}
          disabled={!isOnline}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                      ${PASTEL_COLORS.red.light} ${PASTEL_COLORS.red.text} hover:opacity-90 border ${PASTEL_COLORS.red.border}`}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

// --- Component: NotificationsFeedSection ---
interface NotificationsFeedProps {
  notifications: NotificationType[];
  unreadCount: number;
  onViewNotification: (notification: NotificationType) => void;
  onToggleFeed?: () => void; // If feed can be collapsed/expanded
  isOnline: boolean;
}
const NotificationsFeedSection: React.FC<NotificationsFeedProps> = ({ notifications, unreadCount, onViewNotification, isOnline }) => {
  const getNotifIcon = (item: NotificationType) => {
    let icon;
    if (item.iconName === 'SparklesIcon') icon = <SparklesIcon className="w-5 h-5" />;
    else if (item.iconName === 'BellIcon') icon = <BellIcon className="w-5 h-5" />;
    else icon = getTransactionIcon(item.iconName as any, "w-5 h-5");

    let color = PASTEL_COLORS.sky.text;
    if (item.type === 'transaction') color = PASTEL_COLORS.mint.text;
    if (item.type === 'quest') color = PASTEL_COLORS.yellow.text;


    return <div className={`p-2 rounded-full ${!item.isRead ? color.replace('text-', 'bg-').replace('-700', '-100').replace('-600', '-100') : 'bg-slate-100'} mr-3`}>{React.cloneElement(icon as any, {className: `w-5 h-5 ${color}`})}</div>;
  };
  
  const recentNotifications = notifications.slice(0, 5); // Show 5 most recent

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-700">Recent Activity</h3>
        <button className="relative p-1 rounded-full hover:bg-slate-100 active:bg-slate-200">
          <BellIcon className={`w-6 h-6 ${unreadCount > 0 ? `${PASTEL_COLORS.blush.text} animate-bell-pulse` : PASTEL_COLORS.textLight}`} />
          {unreadCount > 0 && (
            <span className={`absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ${PASTEL_COLORS.blush.button} ring-2 ring-white`} />
          )}
        </button>
      </div>
      {recentNotifications.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {recentNotifications.map(notif => (
            <li key={notif.id} className={`py-3 first:pt-0 last:pb-0 ${!notif.isRead ? 'font-semibold' : ''}`}>
              <button 
                onClick={() => onViewNotification(notif)} 
                disabled={!isOnline && (notif.type === 'transaction' || notif.type === 'quest')} // Example: some notifications might require online for details
                className="flex items-center w-full text-left hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {getNotifIcon(notif)}
                <div className="flex-1">
                  <p className={`text-sm ${!notif.isRead ? PASTEL_COLORS.textDark : PASTEL_COLORS.textLight} leading-snug`}>{notif.text}</p>
                  <p className={`text-xs ${PASTEL_COLORS.textLight} mt-0.5`}>{notif.date}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`${PASTEL_COLORS.textLight} text-sm`}>No new notifications.</p>
      )}
       <style>{`
        @keyframes bellPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(3deg); }
        }
        .animate-bell-pulse { animation: bellPulse 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// --- Interface for Confirmation Modal Content State ---
interface ConfirmModalContentType {
  title: string;
  message: React.ReactNode;
  confirmText: string;
  color: string;
  icon: React.ReactNode;
}

// --- Main ProfilePage Component ---
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(MOCK_USER);
  const [settings, setSettings] = useState<ProfileSettings>(MOCK_PROFILE_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationType[]>(MOCK_NOTIFICATIONS);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'export' | 'delete' | null>(null);
  const [confirmModalContent, setConfirmModalContent] = useState<ConfirmModalContentType>({ 
    title: '', 
    message: '', 
    confirmText: 'Confirm', 
    color: PASTEL_COLORS.mint.button, 
    icon: <></> 
  });

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;


  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); showToast('info', 'You are back online.'); };
    const handleOffline = () => { setIsOnline(false); showToast('info', "You're offline. Changes will sync when reconnected."); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    setToast({ id: Date.now().toString(), type, message });
  }, []);

  const dismissToast = (id: string) => {
    if (toast && toast.id === id) setToast(null);
  };

  const handleSettingToggle = (key: keyof ProfileSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('success', `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} preference updated.`);
    // In a real app, this would also trigger an API call
  };

  const handleCopyAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
        .then(() => showToast('success', 'Wallet address copied to clipboard!'))
        .catch(() => showToast('error', 'Failed to copy address.'));
    }
  };
  
  const handleEditProfile = () => showToast('info', 'Edit profile clicked (feature coming soon).');

  const handleViewBadge = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    setIsBadgeModalOpen(true);
  };
  
  const handleExportData = () => {
    setConfirmAction('export');
    setConfirmModalContent({
      title: 'Export Your Data',
      message: 'We will prepare your data for download. This might take a few moments. You will be notified when it is ready.',
      confirmText: 'Proceed',
      color: PASTEL_COLORS.sky.button,
      icon: <CheckCircleIcon className={`w-10 h-10 ${PASTEL_COLORS.sky.text}`}/>
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setConfirmAction('delete');
    setConfirmModalContent({
      title: 'Delete Account',
      message: <>Are you sure you want to delete your account? <strong className={PASTEL_COLORS.red.text}>This action is permanent and cannot be undone.</strong></>,
      confirmText: 'Delete My Account',
      color: PASTEL_COLORS.red.button,
      icon: <ExclamationCircleIcon className={`w-10 h-10 ${PASTEL_COLORS.red.text}`}/>
    });
    setIsConfirmModalOpen(true);
  };
  
  const handleConfirmAction = () => {
    if (confirmAction === 'export') {
      showToast('success', 'Data export process started!');
      // Simulate export process
    } else if (confirmAction === 'delete') {
      showToast('success', 'Account deletion process initiated.');
      // Simulate deletion and navigate away or log out
      setTimeout(() => navigate('/'), 2000); // Example: navigate to home
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };
  
  const handleViewNotification = (notification: NotificationType) => {
      setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, isRead: true} : n));
      showToast('info', `Notification: "${notification.text}" (details view WIP).`);
      // Potentially open a modal with more details or navigate
  };


  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <OfflineBanner 
        isOnline={isOnline} 
        message="Offline – profile changes and badge sync will update when reconnected." 
      />
      
      <header className="p-4 sticky top-0 bg-slate-100/90 backdrop-blur-md z-20 border-b border-slate-200 sm:hidden">
        <h1 className="text-2xl font-bold text-slate-800 text-center">Profile & Settings</h1>
      </header>

      <main className="flex-grow p-4 pb-24 space-y-6 overflow-y-auto">
        <ProfileInfoCard user={user} onEdit={handleEditProfile} onCopyAddress={handleCopyAddress} isOnline={isOnline} />
        <NotificationPreferencesSection settings={settings} onToggle={handleSettingToggle} isOnline={isOnline} />
        <RecentBadgesSection badges={MOCK_BADGES} onViewBadge={handleViewBadge} onViewAll={() => navigate('/badges')} />
        <NotificationsFeedSection notifications={notifications} unreadCount={unreadNotificationsCount} onViewNotification={handleViewNotification} isOnline={isOnline}/>
        <AccountActionsSection onExportData={handleExportData} onDeleteAccount={handleDeleteAccount} isOnline={isOnline} />
      </main>

      <BadgeDetailModal 
        isOpen={isBadgeModalOpen} 
        onClose={() => setIsBadgeModalOpen(false)} 
        badge={selectedBadge} 
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        confirmText={confirmModalContent.confirmText}
        confirmButtonColor={confirmModalContent.color}
        icon={confirmModalContent.icon}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default ProfilePage;