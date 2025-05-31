import React from 'react';

export interface User {
  name: string;
  avatarUrl: string;
  xp: number;
  balance: number; // Wallet balance
  currency: string;
  streak: number;
  transactions?: Transaction[];
  email?: string;
  walletAddress?: string;

  // New fields for Progress/Profile screen
  level: number;
  xpForNextLevel: number; // Total XP needed to reach the next level
  coinBalance: number; // Gamification coins, distinct from wallet balance
  attendedEvents: AttendedEvent[];
  activeQuests: Quest[]; // Re-using Quest type for active quests
  totalXP: number;
  totalCoinsEarned: number; // Total gamification coins earned
  totalBadgesEarned: number;
  motivationalSubtitle?: string; // e.g., "Level Up!"
}

export interface AttendedEvent {
  eventId: string; // Corresponds to an Event's id
  eventName: string;
  eventDate: string; // Simple date string for display
  eventLogoUrl?: string; // or icon
  eventAbstractColor: string; // from Event.abstractColor
  xpEarned: number;
  coinsGained: number;
  mainBadges: Pick<BadgeItem, 'id' | 'iconUrl' | 'name'>[]; // A few key badges from this event
  isLive?: boolean;
}

export interface BrandActivation {
  id: string;
  name:string;
  logoUrl?: string;
  xpAvailable: number;
  themeColor: string;
  description?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface Shop {
  id: string;
  name: string;
  iconUrl?: string;
  topItem: ShopItem;
  themeColor: string;
}

export interface Event {
  id: string;
  name: string;
  dates: string;
  location: string;
  status: 'locked' | 'unlocked' | 'entered';
  isUnlockedByUser?: boolean;
  imageUrl?: string;
  abstractColor: string;
  themeColor: string;
  description?: string;
  mapImageUrl?: string;
  brandActivations?: BrandActivation[];
  shops?: Shop[];
  faqLink?: string;
}

export interface Quest {
  id: string;
  title: string;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
  rewardText?: string; // e.g., "+50 XP" or "New Badge!"
}

export interface BadgeItem {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  isLocked?: boolean;
  unlockDate?: string;
  howToEarn?: string; // Added for badge modal
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  isSpecial?: boolean;
}

export type TransactionType = 'top-up' | 'purchase' | 'send' | 'receive';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: string;
  date: string;
  iconName: 'ArrowUpCircleIcon' | 'CoffeeIcon' | 'ShoppingBagIcon' | 'PaperAirplaneIcon' | 'ArrowDownCircleIcon' | 'QuestionMarkCircleIcon';
  accentColor: string;
  merchantOrRecipient?: string;
  status?: 'completed' | 'pending' | 'failed';
}

export interface ProfileSettings {
  appNotifications: boolean;
  emailUpdates: boolean;
  eventReminders: boolean;
}

export type NotificationType = 'transaction' | 'quest' | 'reminder' | 'generic';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  text: string;
  date: string;
  iconName?: Transaction['iconName'] | 'SparklesIcon' | 'BellIcon';
  isRead: boolean;
}