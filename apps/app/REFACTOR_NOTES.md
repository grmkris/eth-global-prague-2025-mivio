# Mivio App Refactoring Notes

## Overview
The app has been refactored to provide a more realistic mobile-first experience with persistent bottom navigation and wallet-gated content, following the design patterns from the provided mockup.

## Key Changes

### 1. **Wallet Guard**
- All content is now protected behind wallet connection
- Users must connect their wallet before accessing any app features
- Clean connection screen with wallet button

### 2. **Bottom Navigation**
- Persistent bottom navigation bar when wallet is connected
- Icon-only design (no text labels) for cleaner look
- 4 main navigation items:
  - **Home**: Dashboard with horizontal scrolling events
  - **Wallet**: Event Coins balance and transactions
  - **Tickets**: User's event tickets
  - **More**: Additional features and settings
- **Central floating scan button** that appears on all screens

### 3. **Home Dashboard - Redesigned**
- Fits on one screen without scrolling
- User avatar and greeting in header
- Notification bell with indicator
- Horizontal scrolling event cards with actual images:
  - Coffee Festival
  - Digital Art Exhibition 
  - Synthwave Festival
- XP progress bar with streak counter
- Quest progress tracker
- Recent badges section with trophy icons
- Balance card with Send/Receive buttons
- Floating green scan button in center

### 4. **Event Cards**
- Larger image preview (h-40)
- Proper event images from public folder
- Click on card or button to navigate to event page
- Different button styles (Enter/Join)

### 5. **Mobile-First Design**
- All pages optimized for mobile viewing
- Bottom padding to account for navigation bar
- Horizontal scroll for events with hidden scrollbar
- Touch-friendly card interfaces

### 6. **New Components Created**
- `bottom-navigation.tsx`: Persistent navigation bar with floating scan button
- `wallet-guard.tsx`: Wallet connection gate
- `home-dashboard.tsx`: Redesigned home screen
- `ui/switch.tsx`: Toggle switch component

### 7. **New Pages**
- `/`: Home dashboard with event discovery
- `/scan`: QR scanner (accessed via floating button)
- `/tickets`: User's event tickets
- `/more`: Menu with profile, achievements, settings, etc.
- `/wallet`: Balance and transactions
- `/profile`: User settings (accessible via More menu)
- `/achievements`: Rewards and leaderboard (accessible via More menu)

## User Flow
1. User opens app → Sees wallet connection screen
2. User connects wallet → Redirected to home dashboard
3. Bottom navigation with floating scan button appears
4. User can browse events horizontally on home screen
5. Click event to view details and participate
6. Scan button available on all screens for quick access

## Technical Notes
- All pages are client components using "use client"
- Wallet state checked using wagmi's `useAccount` hook
- Each page includes `<WalletGuard>` and `<BottomNavigation>`
- Event images served from public folder
- Horizontal scroll uses custom CSS utility class `scrollbar-hide` 