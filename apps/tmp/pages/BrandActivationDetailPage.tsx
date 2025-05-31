import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS, MOCK_USER, MOCK_BADGES, PASTEL_COLORS } from '../constants';
import { Event as EventType, BrandActivation, BadgeItem, Quest } from '../types';
import BrandActivationHeader from '../components/brandActivationDetail/BrandActivationHeader';
import XPStatusCard from '../components/brandActivationDetail/XPStatusCard';
import BrandInfoCard from '../components/brandActivationDetail/BrandInfoCard';
import QuestCompleteModal from '../components/brandActivationDetail/QuestCompleteModal';
import Confetti from '../components/brandActivationDetail/Confetti';
import OfflineBanner from '../components/brandActivationDetail/OfflineBanner';
import Toast, { ToastMessage } from '../components/brandActivationDetail/Toast';
import { TicketIcon } from '../components/icons/NavIcons';

// Mock quest specific to "Neon Booth"
const NEON_BOOTH_QUEST: Quest = {
  id: "neonQuest1",
  title: "Visit 3 booths", // As per prompt
  currentProgress: 2, // Initial state as per prompt
  targetProgress: 3,
  isCompleted: false,
};

const XP_FROM_NEON_BOOTH_CHECKIN = 40; // As per prompt

const BrandActivationDetailPage: React.FC = () => {
  const { eventId, activationId } = useParams<{ eventId: string; activationId: string }>();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventType | null>(null);
  const [activationData, setActivationData] = useState<BrandActivation | null>(null);
  
  // Gamification State
  const [userXPInActivation, setUserXPInActivation] = useState(80); // Initial XP for "Neon Booth" as per prompt
  const [quest, setQuest] = useState<Quest>(NEON_BOOTH_QUEST);
  const [dailyStreak, setDailyStreak] = useState(MOCK_USER.streak);
  const [soulboundNftLevel, setSoulboundNftLevel] = useState<1 | 2 | 3>(2); // Initial based on 80XP
  
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeItem | null>(null);

  // UI State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [checkInButtonAnimation, setCheckInButtonAnimation] = useState('animate-bounce-once');


  useEffect(() => {
    const foundEvent = MOCK_EVENTS.find(e => e.id === eventId);
    if (foundEvent) {
      setEventData(foundEvent);
      const foundActivation = foundEvent.brandActivations?.find(act => act.id === activationId);
      if (foundActivation) {
        setActivationData(foundActivation);
      } else {
        // Activation not found, redirect or show error
        navigate('/events'); // Or a specific error page
      }
    } else {
      // Event not found
      navigate('/events');
    }
    
    // Bounce animation for check-in button on mount
    const timer = setTimeout(() => setCheckInButtonAnimation(''), 1000); // remove after 1s

    // Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [eventId, activationId, navigate]);

  useEffect(() => {
    // Update Soulbound NFT level based on XP
    if (userXPInActivation <= 50) setSoulboundNftLevel(1);
    else if (userXPInActivation <= 100) setSoulboundNftLevel(2);
    else setSoulboundNftLevel(3);
  }, [userXPInActivation]);


  const handleCheckIn = () => {
    if (isCheckedIn || isLoading) return;
    if (!isOnline) {
      setToast({ id: 'offline', type: 'error', message: "Offline – Check-in will sync when connected." });
      // Simulate local XP gain for UI, actual sync would be more complex
      // setUserXPInActivation(prev => prev + (activationData?.xpAvailable || XP_FROM_NEON_BOOTH_CHECKIN));
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock success
      const xpGained = activationData ? (activationData.xpAvailable - userXPInActivation > 0 ? XP_FROM_NEON_BOOTH_CHECKIN : 0) : XP_FROM_NEON_BOOTH_CHECKIN;
      
      setUserXPInActivation(prev => Math.min(prev + xpGained, activationData?.xpAvailable || 150));
      setIsCheckedIn(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Confetti duration

      // Update quest progress
      const newQuestProgress = quest.currentProgress + 1;
      const questCompleted = newQuestProgress >= quest.targetProgress;
      setQuest(prev => ({ ...prev, currentProgress: newQuestProgress, isCompleted: questCompleted }));

      if (questCompleted) {
        const arcadeBadge = MOCK_BADGES.find(b => b.id === 'bdg2'); // "Arcade Pro"
        if (arcadeBadge) {
          setUnlockedBadge(arcadeBadge);
          setShowQuestModal(true);
        }
      }
      
      // Potentially update streak (if logic dictates, e.g., first check-in of the day)
      // For demo, streak remains, but icon could pulse
      // setDailyStreak(prev => prev + 1); // Example, not strictly per prompt here

      setToast({ id: 'checkin-success', type: 'success', message: `Checked In! +${xpGained} XP earned.` });
      setIsLoading(false);

    }, 1500); // Simulate network delay
  };
  
  const handleCloseQuestModal = () => {
    setShowQuestModal(false);
    setUnlockedBadge(null);
  };

  const dismissToast = (id: string) => {
    if (toast && toast.id === id) {
      setToast(null);
    }
  };

  if (!eventData || !activationData) {
    return (
      <div className="p-4 text-center min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <TicketIcon className="w-16 h-16 text-slate-400 mb-4" />
        <h1 className="text-xl font-semibold text-slate-700">Loading Activation...</h1>
        <p className={`${PASTEL_COLORS.textLight} mb-6`}>Please wait or try refreshing.</p>
         <Link to="/events" className={`${PASTEL_COLORS.mint.button} text-white py-2 px-4 rounded-lg`}>
          Back to Events
        </Link>
      </div>
    );
  }
  
  const currentTotalXPForActivation = activationData.xpAvailable;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <OfflineBanner isOnline={isOnline} />
      <BrandActivationHeader activation={activationData} />
      
      <main className="flex-grow flex flex-col p-4 space-y-6 overflow-y-auto pb-24"> {/* pb-24 for nav bar */}
        <XPStatusCard
          xpAvailableForCheckIn={XP_FROM_NEON_BOOTH_CHECKIN} // XP available from THIS specific check-in action
          currentXPInActivation={userXPInActivation}
          totalXPInActivation={currentTotalXPForActivation}
          questTitle={quest.title}
          questCurrentProgress={quest.currentProgress}
          questTargetProgress={quest.targetProgress}
          isQuestCompleted={quest.isCompleted}
          dailyStreak={dailyStreak}
          soulboundNftLevel={soulboundNftLevel}
        />

        <div className={`text-center py-4 ${checkInButtonAnimation}`}>
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn || isLoading || !isOnline}
            className={`w-full max-w-xs mx-auto text-white py-4 px-8 rounded-2xl text-xl font-semibold shadow-lg transition-all duration-300
                        ${isCheckedIn ? `${PASTEL_COLORS.sky.button} opacity-70 cursor-default` : `${PASTEL_COLORS.blush.button} hover:opacity-90 active:scale-95`}
                        disabled:opacity-50 disabled:cursor-not-allowed transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400`}
          >
            {isLoading ? 'Checking In...' : (isCheckedIn ? 'Checked In!' : 'Check In')}
          </button>
          {!isCheckedIn && !isLoading && (
             <p className={`text-xs ${PASTEL_COLORS.textLight} mt-2`}>Earn +{XP_FROM_NEON_BOOTH_CHECKIN} XP for this activation!</p>
          )}
        </div>

        <BrandInfoCard description={activationData.description || "Engage with this brand activation to earn XP and complete quests!"} />

        <div className="mt-auto pt-6 text-center">
          <Link 
            to={`/event/${eventId}`} 
            className={`text-sm ${PASTEL_COLORS.lavender.text} font-medium hover:underline hover:text-purple-700`}
          >
            Back to {eventData.name} Details
          </Link>
        </div>
      </main>

      <Toast toast={toast} onDismiss={dismissToast} />
      {showQuestModal && unlockedBadge && <QuestCompleteModal badge={unlockedBadge} onClose={handleCloseQuestModal} />}
      {showConfetti && <Confetti />}
      
      {/* BottomNavigationBar is rendered by App.tsx */}
      <style>{`
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0) scale(1); }
          20%, 50% { transform: translateY(-8px) scale(1.05); }
          40% { transform: translateY(0) scale(1); }
          60% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-bounce-once { animation: bounceOnce 1s ease-out; }
      `}</style>
    </div>
  );
};

export default BrandActivationDetailPage;