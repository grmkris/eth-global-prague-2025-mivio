import { User, Event, Quest, BadgeItem, BrandActivation, Shop, ShopItem, Transaction, ProfileSettings, NotificationItem, AttendedEvent } from './types';

export const PASTEL_COLORS = {
  lavender: { DEFAULT: 'bg-purple-300', light: 'bg-purple-100', text: 'text-purple-700', button: 'bg-purple-500 hover:bg-purple-600', filled_icon: 'text-purple-600', border: 'border-purple-300', ring: 'ring-purple-300' },
  mint: { DEFAULT: 'bg-green-300', light: 'bg-green-100', text: 'text-green-700', button: 'bg-green-500 hover:bg-green-600', filled_icon: 'text-green-600', border: 'border-green-300', ring: 'ring-green-300' },
  blush: { DEFAULT: 'bg-pink-300', light: 'bg-pink-100', text: 'text-pink-700', button: 'bg-pink-500 hover:bg-pink-600', filled_icon: 'text-pink-600', border: 'border-pink-300', ring: 'ring-pink-300' },
  sky: { DEFAULT: 'bg-sky-300', light: 'bg-sky-100', text: 'text-sky-700', button: 'bg-sky-500 hover:bg-sky-600', filled_icon: 'text-sky-600', border: 'border-sky-300', ring: 'ring-sky-300' },
  yellow: { DEFAULT: 'bg-yellow-300', light: 'bg-yellow-100', text: 'text-yellow-700', button: 'bg-yellow-500 hover:bg-yellow-600', filled_icon: 'text-yellow-600', border: 'border-yellow-300', ring: 'ring-yellow-300' },
  red: { DEFAULT: 'bg-red-400', light: 'bg-red-100', text: 'text-red-700', button: 'bg-red-500 hover:bg-red-600', filled_icon: 'text-red-600', border: 'border-red-300', ring: 'ring-red-300' },
  textLight: 'text-slate-500',
  textDark: 'text-slate-800',
  cardBg: 'bg-white',
  inputBorder: 'border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
  error: 'text-red-500',
  success: 'text-green-500',
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "txn1", type: "top-up", description: "Top Up", amount: 100.00, currency: "USDC", date: "Today, 13:22", iconName: 'ArrowUpCircleIcon', accentColor: PASTEL_COLORS.mint.light, merchantOrRecipient: "Self", status: "completed" },
  { id: "txn2", type: "purchase", description: "Bought Coffee", amount: -6.00, currency: "USDC", date: "Today, 09:10", iconName: 'CoffeeIcon', accentColor: PASTEL_COLORS.blush.light, merchantOrRecipient: "Synth Bites Cafe", status: "completed" },
  { id: "txn3", type: "purchase", description: "Bought T-shirt", amount: -24.00, currency: "USDC", date: "Yesterday, 16:48", iconName: 'ShoppingBagIcon', accentColor: PASTEL_COLORS.sky.light, merchantOrRecipient: "Festival Merch", status: "completed" },
  { id: "txn4", type: "send", description: "Sent to David", amount: -10.00, currency: "USDC", date: "2 days ago, 11:05", iconName: 'PaperAirplaneIcon', accentColor: PASTEL_COLORS.lavender.light, merchantOrRecipient: "David Lee", status: "completed" },
  { id: "txn5", type: "receive", description: "Received from Eve", amount: 20.00, currency: "USDC", date: "3 days ago, 19:30", iconName: 'ArrowDownCircleIcon', accentColor: PASTEL_COLORS.yellow.light, merchantOrRecipient: "Eve Martin", status: "completed" },
];

export const MOCK_BADGES: BadgeItem[] = [
  { id: "bdg1", name: "Night Owl", iconUrl: "https://picsum.photos/seed/nightowlbadge/80/80", description: "Attended a late night event after 10 PM.", unlockDate: "Unlocked: Jun 9, 2024", isLocked: false, howToEarn: "Check-in to any event activity after 10 PM." },
  { id: "bdg2", name: "Arcade Pro", iconUrl: "https://picsum.photos/seed/arcadeprobadge/80/80", description: "Mastered the arcade games at Neon Booth.", unlockDate: "Unlocked: Jun 8, 2024", isLocked: false, howToEarn: "Achieve a high score or complete specific challenges at an event arcade." },
  { id: "bdg3", name: "Early Bird", iconUrl: "https://picsum.photos/seed/earlybirdbadge/80/80", description: "Joined an event before 10 AM.", unlockDate: "Unlocked: Jun 10, 2024", isLocked: false, howToEarn: "Be one of the first to check-in to an event on any given day." },
  { id: "bdg4", name: "Explorer", iconUrl: "https://picsum.photos/seed/explorerbadge/80/80?grayscale", description: "Visited all zones in an event.", isLocked: true, howToEarn: "Check-in to at least one activation in every designated zone of a festival." },
  { id: "bdg5", name: "Synthwave Starter", iconUrl: "https://picsum.photos/seed/synthstarter/80/80", description: "Attended your first Synthwave Fest.", unlockDate: "Unlocked: Jun 8, 2024", isLocked: false, howToEarn: "Attend any Synthwave Fest event." },
];

export const MOCK_ATTENDED_EVENTS: AttendedEvent[] = [
  {
    eventId: "synthwave-fest",
    eventName: "Synthwave Fest '24",
    eventDate: "Jun 8–10, 2024",
    eventLogoUrl: "https://picsum.photos/seed/synthwavefest/100/100", // Using event image as logo here
    eventAbstractColor: "bg-purple-200",
    xpEarned: 750,
    coinsGained: 80,
    mainBadges: [
      { id: "bdg5", name: "Synthwave Starter", iconUrl: MOCK_BADGES.find(b => b.id === 'bdg5')?.iconUrl || '' },
      { id: "bdg2", name: "Arcade Pro", iconUrl: MOCK_BADGES.find(b => b.id === 'bdg2')?.iconUrl || '' }
    ],
    isLive: true,
  },
  {
    eventId: "art-expo",
    eventName: "Art Expo '23",
    eventDate: "Aug 1-3, 2023",
    eventLogoUrl: "https://picsum.photos/seed/artexpo/100/100",
    eventAbstractColor: "bg-pink-200",
    xpEarned: 400,
    coinsGained: 30,
    mainBadges: [
       { id: "bdg3", name: "Early Bird", iconUrl: MOCK_BADGES.find(b => b.id === 'bdg3')?.iconUrl || '' }
    ],
  }
];

export const MOCK_ACTIVE_QUESTS: Quest[] = [
  {
    id: "qstActive1",
    title: "Visit 3 Synthwave Booths",
    currentProgress: 2,
    targetProgress: 3,
    isCompleted: false,
    rewardText: "+100 XP, +10 Coins"
  },
  {
    id: "qstActive2",
    title: "Daily Check-in Streak",
    currentProgress: 4, // Current streak days
    targetProgress: 7, // Target for a weekly bonus
    isCompleted: false,
    rewardText: "Bonus Badge!"
  }
];

export const MOCK_USER: User = {
  name: "Anna",
  avatarUrl: "https://picsum.photos/seed/anna/200/200", // Larger avatar for profile
  xp: 1340,
  balance: 160.00, // Wallet
  currency: "USDC",
  streak: 4,
  transactions: MOCK_TRANSACTIONS.slice(0,1),
  email: "anna@example.com",
  walletAddress: "0x5AcD43B6B1A7A03D9A6b82E2A2dF7c13a0A781C2",

  // Progress/Profile specific
  level: 6,
  xpForNextLevel: 2000, // XP needed to reach level 7
  coinBalance: 150, // Gamification coins
  attendedEvents: MOCK_ATTENDED_EVENTS,
  activeQuests: MOCK_ACTIVE_QUESTS,
  totalXP: 1150, // Total from MOCK_ATTENDED_EVENTS (750+400)
  totalCoinsEarned: 110, // Total from MOCK_ATTENDED_EVENTS (80+30)
  totalBadgesEarned: MOCK_BADGES.filter(b => !b.isLocked).length,
  motivationalSubtitle: "Festival Legend in the Making!",
};


const SYNTHWAVE_BRAND_ACTIVATIONS: BrandActivation[] = [
  { id: "ba1", name: "Neon Booth", xpAvailable: 150, logoUrl: "✨", themeColor: "bg-pink-100", description: "Step into the dazzling Neon Booth! Test your reflexes on classic arcade games and rack up XP. High scores might unlock secret bonuses." },
  { id: "ba2", name: "Zero Sugar Lounge", xpAvailable: 100, logoUrl: "🥤", themeColor: "bg-cyan-100", description: "Chill out at the Zero Sugar Lounge. Sample new flavors, participate in a quick survey, and earn XP." },
  { id: "ba3", name: "Retro Arcade", xpAvailable: 200, logoUrl: "👾", themeColor: "bg-purple-100", description: "A haven for retro gaming enthusiasts. Beat challenges, set high scores, and collect substantial XP rewards." },
];

const SYNTHWAVE_SHOPS: Shop[] = [
  {
    id: "shop1",
    name: "Synth Bites",
    topItem: { id: "item1", name: "Festival T-shirt", price: 24, currency: "USDC" },
    iconUrl: "👕",
    themeColor: "bg-orange-100",
  },
  {
    id: "shop2",
    name: "Caffeine Kings",
    topItem: { id: "item2", name: "Neon Coffee", price: 6, currency: "USDC" },
    iconUrl: "☕",
    themeColor: "bg-yellow-100",
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "synthwave-fest",
    name: "Synthwave Fest",
    dates: "Jun 8–10",
    location: "Berlin",
    status: "unlocked",
    isUnlockedByUser: true,
    imageUrl: "https://picsum.photos/seed/synthwavefest/400/200",
    themeColor: "bg-purple-500",
    abstractColor: "bg-purple-200",
    description: "Immerse yourself in the retro-futuristic sounds of Synthwave. Three days of neon lights, iconic artists, and unforgettable vibes.",
    mapImageUrl: "https://picsum.photos/seed/synthmap/600/300?blur=2",
    brandActivations: SYNTHWAVE_BRAND_ACTIVATIONS,
    shops: SYNTHWAVE_SHOPS,
    faqLink: "#",
  },
  {
    id: "coffee-carnival",
    name: "Coffee Carnival",
    dates: "Jul 15",
    location: "Online",
    status: "locked",
    isUnlockedByUser: false,
    imageUrl: "https://picsum.photos/seed/coffeecarnival/400/200",
    themeColor: "bg-green-500",
    abstractColor: "bg-green-200",
    description: "Join the biggest online coffee celebration! Discover new beans, learn brewing techniques, and connect with coffee lovers.",
    mapImageUrl: "https://picsum.photos/seed/coffeemap/600/300?blur=2",
    brandActivations: [
      { id: "ba4", name: "Bean Quiz", xpAvailable: 50, logoUrl: "❓", themeColor: "bg-yellow-100", description: "Test your coffee knowledge and earn XP!" },
    ],
    shops: [
       { id: "shop3", name: "Global Blends", topItem: {id: "item3", name: "Rare Geisha Beans", price: 35, currency: "USDC"}, iconUrl: "🌍", themeColor: "bg-lime-100"}
    ],
    faqLink: "#",
  },
  {
    id: "art-expo",
    name: "Art Expo",
    dates: "Aug 1-3",
    location: "Paris",
    status: "unlocked",
    isUnlockedByUser: true, // Corrected, was previously locked
    imageUrl: "https://picsum.photos/seed/artexpo/400/200",
    themeColor: "bg-pink-500",
    abstractColor: "bg-pink-200",
    description: "A stunning showcase of modern and contemporary art from around the globe. Meet artists, attend workshops, and find your next masterpiece.",
    mapImageUrl: "https://picsum.photos/seed/artmap/600/300?blur=2",
    brandActivations: [
       { id: "ba5", name: "Live Painting", xpAvailable: 120, logoUrl: "🎨", themeColor: "bg-red-100", description: "Watch artists create masterpieces live and earn XP for participating in Q&A sessions." },
    ],
    shops: [
      { id: "shop4", name: "Artisan Prints", topItem: {id: "item4", name: "Limited Edition Print", price: 75, currency: "USDC"}, iconUrl: "🖼️", themeColor: "bg-blue-100"}
    ],
    faqLink: "#",
  },
];


export const MOCK_QUEST: Quest = { // This is a general quest, MOCK_ACTIVE_QUESTS is now specific to user
  id: "qstGlobal1",
  title: "General Event Engagement",
  currentProgress: 1,
  targetProgress: 5,
  isCompleted: false,
};


export const UNREAD_NOTIFICATIONS_COUNT = 3;

export const MOCK_PROFILE_SETTINGS: ProfileSettings = {
  appNotifications: true,
  emailUpdates: true,
  eventReminders: false,
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "notif1", type: "transaction", text: "Bought Coffee – $6", date: "10m ago", iconName: "CoffeeIcon", isRead: false },
  { id: "notif2", type: "quest", text: "Quest Complete: Visit 3 booths", date: "1h ago", iconName: "SparklesIcon", isRead: false },
  { id: "notif3", type: "transaction", text: "Top Up – $100", date: "Yesterday", iconName: "ArrowUpCircleIcon", isRead: false },
  { id: "notif4", type: "reminder", text: "Synthwave Fest starts tomorrow!", date: "2 days ago", iconName: "BellIcon", isRead: true },
  { id: "notif5", type: "generic", text: "Welcome to mivio! Explore and earn.", date: "3 days ago", isRead: true },
];