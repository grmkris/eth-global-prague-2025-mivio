import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER, MOCK_BADGES, PASTEL_COLORS } from '../constants';
import { User, AttendedEvent, BadgeItem, Quest as QuestType } from '../types';
import OfflineBanner from '../components/brandActivationDetail/OfflineBanner';
import Toast, { ToastMessage } from '../components/brandActivationDetail/Toast';
import BadgeDetailModal from '../components/modals/BadgeDetailModal';
import { 
    CoinIcon, 
    FlameIcon, 
    ChevronRightIcon,
    SparklesIcon, // For XP
    TicketIcon // For event history empty state
} from '../components/icons/NavIcons';

// --- Helper: Animated Number ---
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 500, className }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startValue = currentValue;
    const endValue = value;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCurrentValue(Math.floor(startValue + (endValue - startValue) * percentage));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(endValue); // Ensure it ends on the exact value
      }
    };

    // Only animate if the value actually changes significantly
    if (Math.abs(endValue - startValue) > 0) {
       requestAnimationFrame(animate);
    } else {
       setCurrentValue(endValue); // Set directly if no change or minor
    }
    
    return () => { // Cleanup
      startTime = null; 
    };
  }, [value, duration, currentValue]);

  return <span className={className}>{currentValue.toLocaleString()}</span>;
};


// --- Component: UserProgressHeader ---
interface UserProgressHeaderProps {
  user: User;
}
const UserProgressHeader: React.FC<UserProgressHeaderProps> = ({ user }) => {
  const xpProgressPercent = user.xpForNextLevel > 0 ? (user.xp / user.xpForNextLevel) * 100 : 0;
  const [avatarClicked, setAvatarClicked] = useState(false);

  const handleAvatarClick = () => {
    setAvatarClicked(true);
    setTimeout(() => setAvatarClicked(false), 300);
  };
  
  return (
    <div className="bg-white p-5 rounded-b-3xl shadow-lg sticky top-0 z-10"> {/* Keep header sticky with rounded bottom */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className={`w-20 h-20 rounded-full shadow-md border-4 border-white cursor-pointer transition-transform duration-300 ${avatarClicked ? 'animate-avatar-bounce' : ''}`}
          onClick={handleAvatarClick}
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
          {user.motivationalSubtitle && <p className={`${PASTEL_COLORS.textLight} text-sm`}>{user.motivationalSubtitle}</p>}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className={`${PASTEL_COLORS.textDark} font-medium`}>Level {user.level}</span>
            <span className={`${PASTEL_COLORS.textLight}`}>
                XP: <AnimatedNumber value={user.xp} className="font-semibold"/> / {user.xpForNextLevel.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`${PASTEL_COLORS.mint.button} h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${xpProgressPercent}%` }}
              role="progressbar"
              aria-valuenow={xpProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`XP progress: ${user.xp} of ${user.xpForNextLevel}`}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <CoinIcon className={`w-6 h-6 ${PASTEL_COLORS.yellow.filled_icon}`} />
          <span className={`${PASTEL_COLORS.textDark} text-lg font-semibold`}><AnimatedNumber value={user.coinBalance} /> Coins</span>
        </div>
      </div>
       <style>{`
        @keyframes avatarBounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-5px); }
        }
        .animate-avatar-bounce { animation: avatarBounce 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// --- Component: EventHistoryCard ---
interface EventHistoryCardProps {
  attendedEvent: AttendedEvent;
  onClick: () => void;
}
const EventHistoryCard: React.FC<EventHistoryCardProps> = ({ attendedEvent, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden p-4 mr-4 transition-all duration-300 hover:shadow-xl active:scale-[0.97] text-left
                  ${attendedEvent.isLive ? `border-2 ${PASTEL_COLORS.mint.border} ring-2 ring-offset-1 ${PASTEL_COLORS.mint.ring}` : ''}`}
    >
      <div className="flex items-start space-x-3 mb-3">
        {attendedEvent.eventLogoUrl ? (
          <img src={attendedEvent.eventLogoUrl} alt={attendedEvent.eventName} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className={`w-12 h-12 ${attendedEvent.eventAbstractColor} rounded-lg flex items-center justify-center`}>
            <TicketIcon className="w-6 h-6 text-slate-500" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-md font-semibold text-slate-800 truncate">{attendedEvent.eventName}</h4>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>{attendedEvent.eventDate}</p>
        </div>
        {attendedEvent.isLive && (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white ${PASTEL_COLORS.mint.button}`}>Live</span>
        )}
      </div>
      <div className="space-y-1.5 text-xs">
        <p className={`${PASTEL_COLORS.textDark}`}><SparklesIcon className={`w-3.5 h-3.5 inline mr-1 ${PASTEL_COLORS.mint.text}`} />XP Earned: <span className="font-medium">{attendedEvent.xpEarned.toLocaleString()}</span></p>
        <p className={`${PASTEL_COLORS.textDark}`}><CoinIcon className={`w-3.5 h-3.5 inline mr-1 ${PASTEL_COLORS.yellow.text}`} />Coins Gained: <span className="font-medium">{attendedEvent.coinsGained}</span></p>
        {attendedEvent.mainBadges.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            <span className={`${PASTEL_COLORS.textLight}`}>Badges:</span>
            {attendedEvent.mainBadges.slice(0,3).map(badge => (
              <img key={badge.id} src={badge.iconUrl} alt={badge.name} title={badge.name} className="w-5 h-5 rounded-full border border-slate-200" />
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

// --- Component: EventHistorySection ---
interface EventHistorySectionProps {
  attendedEvents: AttendedEvent[];
  onEventClick: (eventId: string) => void;
}
const EventHistorySection: React.FC<EventHistorySectionProps> = ({ attendedEvents, onEventClick }) => {
  const liveEvent = attendedEvents.find(e => e.isLive);
  const pastEvents = attendedEvents.filter(e => !e.isLive);
  const sortedEvents = liveEvent ? [liveEvent, ...pastEvents] : pastEvents;

  if (sortedEvents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <TicketIcon className={`w-12 h-12 mx-auto mb-3 ${PASTEL_COLORS.sky.text} opacity-50`} />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No Event History Yet</h3>
        <p className={`${PASTEL_COLORS.textLight} text-sm mb-3`}>Attend your first event to start earning XP and badges!</p>
        <Link to="/events" className={`${PASTEL_COLORS.sky.button} text-white py-2 px-4 rounded-xl text-sm font-medium`}>
          Discover Events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-700 mb-3 px-1">Festival History</h3>
      <div className="flex overflow-x-auto space-x-0 pb-3 scrollbar-hide -mx-4 px-4"> {/* Negative margin pull for edge-to-edge feel */}
        {sortedEvents.map((event) => (
          <EventHistoryCard key={event.eventId} attendedEvent={event} onClick={() => onEventClick(event.eventId)} />
        ))}
      </div>
    </div>
  );
};

// --- Component: UserBadgesSection ---
interface UserBadgesSectionProps {
  badges: BadgeItem[];
  onViewBadge: (badge: BadgeItem) => void;
  onViewAll: () => void;
}
const UserBadgesSection: React.FC<UserBadgesSectionProps> = ({ badges, onViewBadge, onViewAll }) => {
  const recentUnlockedBadges = badges.filter(b => !b.isLocked).slice(0, 4); // Show up to 4 recent unlocked

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-700">Your Badges</h3>
        <button onClick={onViewAll} className={`text-sm ${PASTEL_COLORS.lavender.text} font-medium hover:underline flex items-center active:scale-95`}>
          View All <ChevronRightIcon className="w-4 h-4 ml-0.5" />
        </button>
      </div>
      {recentUnlockedBadges.length > 0 ? (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {recentUnlockedBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => onViewBadge(badge)}
              className="flex flex-col items-center space-y-1 group p-1 rounded-lg hover:bg-slate-50 active:scale-90 transition-transform"
              aria-label={`View badge: ${badge.name}`}
            >
              <img 
                src={badge.iconUrl} 
                alt={badge.name} 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md border-2 border-white group-hover:scale-105 transition-transform" 
              />
              <p className={`text-xs ${PASTEL_COLORS.textLight} group-hover:text-slate-700 truncate w-full text-center`}>{badge.name}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className={`${PASTEL_COLORS.textLight} text-sm`}>No badges earned yet. Keep exploring!</p>
      )}
    </div>
  );
};

// --- Component: XPQuestStatsCard ---
interface XPQuestStatsCardProps {
  activeQuests: QuestType[];
  streak: number;
  userXP: number;
}
const XPQuestStatsCard: React.FC<XPQuestStatsCardProps> = ({ activeQuests, streak, userXP }) => {
  const nextBadgeXPThreshold = Math.ceil((userXP + 50) / 50) * 50; // Example: next badge every 50 XP
  const xpToNextBadge = Math.max(0, nextBadgeXPThreshold - userXP);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg space-y-4">
      <h3 className="text-xl font-semibold text-slate-700">XP & Quest Stats</h3>
      
      {activeQuests.length > 0 ? activeQuests.slice(0,2).map(quest => (
        <div key={quest.id}>
          <div className="flex justify-between items-baseline text-sm mb-1">
            <span className={`${PASTEL_COLORS.textDark} font-medium truncate pr-2`}>{quest.title}</span>
            <span className={`${PASTEL_COLORS.textLight}`}>{quest.currentProgress}/{quest.targetProgress}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className={`${PASTEL_COLORS.blush.button} h-2.5 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${(quest.currentProgress / quest.targetProgress) * 100}%` }}
            />
          </div>
          {quest.rewardText && <p className={`text-xs ${PASTEL_COLORS.blush.text} mt-1`}>{quest.rewardText}</p>}
        </div>
      )) : (
         <p className={`${PASTEL_COLORS.textLight} text-sm`}>No active quests right now. Check back soon!</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <FlameIcon className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 animate-pulse-streak' : PASTEL_COLORS.textLight}`} />
          <span className={`${PASTEL_COLORS.textDark} font-medium`}>{streak} day streak</span>
        </div>
        {xpToNextBadge > 0 && <p className={`${PASTEL_COLORS.mint.text} text-sm font-medium`}>Just {xpToNextBadge} XP to next reward!</p>}
      </div>
      <style>{`
        @keyframes pulseStreak {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        .animate-pulse-streak { animation: pulseStreak 1.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

// --- Component: TotalRewardsCard ---
interface TotalRewardsCardProps {
  totalXP: number;
  totalCoins: number;
  totalBadges: number;
}
const TotalRewardsCard: React.FC<TotalRewardsCardProps> = ({ totalXP, totalCoins, totalBadges }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">Total Earned</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className={`text-2xl font-bold ${PASTEL_COLORS.mint.text}`}><AnimatedNumber value={totalXP}/></p>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>Total XP</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${PASTEL_COLORS.yellow.text}`}><AnimatedNumber value={totalCoins}/></p>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>Coins</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${PASTEL_COLORS.lavender.text}`}><AnimatedNumber value={totalBadges}/></p>
          <p className={`text-xs ${PASTEL_COLORS.textLight}`}>Badges</p>
        </div>
      </div>
    </div>
  );
};


// --- Main ProgressProfilePage Component ---
const ProgressProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<User>(MOCK_USER); // Assuming MOCK_USER has the new fields
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); showToast('info', 'You are back online.'); };
    const handleOffline = () => { setIsOnline(false); showToast('info', "Offline – progress and badge sync will update when reconnected."); };
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

  const handleViewBadge = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    setIsBadgeModalOpen(true);
  };
  
  const handleEventHistoryClick = (eventId: string) => {
    navigate(`/events/${eventId}`); // Navigate to the event detail page
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <OfflineBanner 
        isOnline={isOnline} 
        message="Offline – progress and badge sync will update when reconnected." 
      />
      <UserProgressHeader user={user} />
      
      <main className="flex-grow p-4 pb-24 space-y-6 overflow-y-auto">
        <EventHistorySection attendedEvents={user.attendedEvents} onEventClick={handleEventHistoryClick} />
        <UserBadgesSection badges={MOCK_BADGES} onViewBadge={handleViewBadge} onViewAll={() => navigate('/badges')} />
        <XPQuestStatsCard activeQuests={user.activeQuests} streak={user.streak} userXP={user.xp} />
        <TotalRewardsCard totalXP={user.totalXP} totalCoins={user.totalCoinsEarned} totalBadges={user.totalBadgesEarned} />
      </main>

      <BadgeDetailModal 
        isOpen={isBadgeModalOpen} 
        onClose={() => setIsBadgeModalOpen(false)} 
        badge={selectedBadge} 
      />
      <Toast toast={toast} onDismiss={dismissToast} />
      {/* BottomNavigationBar is rendered by App.tsx */}
    </div>
  );
};

export default ProgressProfilePage;