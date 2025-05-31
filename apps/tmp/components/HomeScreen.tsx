
import React, { useState, useEffect } from 'react';
import { MOCK_USER, MOCK_EVENTS, MOCK_QUEST, MOCK_BADGES, UNREAD_NOTIFICATIONS_COUNT, PASTEL_COLORS } from '../constants';
import { User, Event, Quest, BadgeItem } from '../types';
import { BellIcon, FlameIcon, CheckIcon, PlusIcon, ChevronRightIcon, SendIcon, ReceiveIcon } from './icons/NavIcons';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {children}
    </div>
  );
};

const Header: React.FC<{ user: User; notificationCount: number }> = ({ user, notificationCount }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full shadow-md" />
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Hello, {user.name}!</h1>
          <p className="text-sm text-slate-500">Your Festival Hub</p>
        </div>
      </div>
      <button className="relative p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
        <BellIcon className="w-6 h-6 text-slate-600" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
    </div>
  );
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const buttonText = event.status === 'locked' ? 'Unlock' : 'Enter';
  const buttonColor = event.status === 'locked' ? PASTEL_COLORS.lavender.button : PASTEL_COLORS.mint.button;

  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 active:scale-100 cursor-pointer">
      {event.imageUrl ? (
         <img src={event.imageUrl} alt={event.name} className="w-full h-32 object-cover" />
      ) : (
        <div className={`w-full h-32 ${event.abstractColor} flex items-center justify-center`}>
           <span className="text-slate-600 text-sm">Abstract Event Art</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 truncate">{event.name}</h3>
        <p className="text-xs text-slate-500 mb-3">{event.dates}, {event.location}</p>
        <button className={`${buttonColor} text-sm font-medium py-2 px-4 rounded-full w-full transition-transform active:scale-95`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};


const XPProgressCard: React.FC<{ user: User; quest: Quest }> = ({ user, quest }) => {
  const progressPercentage = quest.targetProgress > 0 ? (quest.currentProgress / quest.targetProgress) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-slate-800">XP: {user.xp.toLocaleString()}</h2>
        <div className="flex items-center space-x-1 text-sm text-orange-500">
          <FlameIcon className="w-5 h-5" />
          <span>{user.streak} day streak</span>
        </div>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3 overflow-hidden">
        <div
          className="bg-green-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex items-center text-sm text-slate-600">
        <span>Current Quest: {quest.title} ({quest.currentProgress}/{quest.targetProgress})</span>
        {quest.isCompleted && <CheckIcon className="w-5 h-5 text-green-500 ml-2" />}
      </div>
    </div>
  );
};

const BadgeHighlight: React.FC<{ badges: BadgeItem[] }> = ({ badges }) => {
  const displayedBadges = badges.slice(0, 3);
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Recent Badges</h2>
        <button className="text-sm text-purple-600 font-medium hover:text-purple-800 flex items-center">
          View All <ChevronRightIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="flex space-x-4 justify-center">
        {displayedBadges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center space-y-1 group cursor-pointer">
            <img src={badge.iconUrl} alt={badge.name} className="w-16 h-16 rounded-full shadow-md border-2 border-white group-hover:scale-110 transition-transform" />
            <p className="text-xs text-slate-500 group-hover:text-slate-700">{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const WalletSummaryCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-slate-500">Balance</p>
          <h2 className="text-2xl font-semibold text-slate-800">{user.currency} ${user.balance.toFixed(2)}</h2>
        </div>
        <button className={`${PASTEL_COLORS.mint.button} rounded-full p-3 shadow-md transition-transform active:scale-90 hover:scale-105`}>
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex space-x-3">
        <button className={`${PASTEL_COLORS.mint.button} flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-transform active:scale-95`}>
          <SendIcon className="w-4 h-4"/>
          <span>Send</span>
        </button>
        <button className={`${PASTEL_COLORS.lavender.button} flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-transform active:scale-95`}>
          <ReceiveIcon className="w-4 h-4"/>
          <span>Receive</span>
        </button>
      </div>
    </div>
  );
};


const HomeScreen: React.FC = () => {
  return (
    <div className="pb-24 bg-slate-50 min-h-screen"> {/* Padding bottom for nav bar, bg-slate-50 for slight off-white canvas */}
      <AnimatedSection delay={0}>
        <Header user={MOCK_USER} notificationCount={UNREAD_NOTIFICATIONS_COUNT} />
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="px-4 mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Upcoming Events</h2>
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
            {MOCK_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </AnimatedSection>
      
      <div className="px-4 space-y-6">
        <AnimatedSection delay={200}>
          <XPProgressCard user={MOCK_USER} quest={MOCK_QUEST} />
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <BadgeHighlight badges={MOCK_BADGES} />
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <WalletSummaryCard user={MOCK_USER} />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default HomeScreen;
