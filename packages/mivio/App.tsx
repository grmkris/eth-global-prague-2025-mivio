import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import BottomNavigationBar from './components/BottomNavigationBar';
import { HomeIcon, TrophyIcon, ScanIcon, WalletIcon, GearIcon, HomeIconFilled, TrophyIconFilled, WalletIconFilled, GearIconFilled } from './components/icons/NavIcons'; // Removed TicketIcon, using TrophyIcon for Progress
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import BrandActivationDetailPage from './pages/BrandActivationDetailPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage'; 
import BadgesPage from './pages/BadgesPage';
import ProgressProfilePage from './pages/ProgressProfilePage'; // Added ProgressProfilePage
import ScanPage from './pages/ScanPage'; // Updated path if it was moved, but it's already correct


const App: React.FC = () => {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, activeIcon: HomeIconFilled, path: '/' },
    { id: 'progress', label: 'Progress', icon: TrophyIcon, activeIcon: TrophyIconFilled, path: '/progress' }, // New Progress Tab
    { id: 'scan', label: 'Scan', icon: ScanIcon, path: '/scan', isSpecial: true },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon, activeIcon: WalletIconFilled, path: '/wallet'},
    // { id: 'badges', label: 'Badges', icon: TrophyIcon, activeIcon: TrophyIconFilled, path: '/badges' }, // Badges are part of Profile/Progress now
    { id: 'profile', label: 'Settings', icon: GearIcon, activeIcon: GearIconFilled, path: '/profile' }, // Profile is now more for settings
  ];

  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/events" element={<EventsListPage />} /> {/* Kept for direct access if needed */}
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/events/:eventId/activation/:activationId" element={<BrandActivationDetailPage />} />
            
            <Route path="/progress" element={<ProgressProfilePage />} /> {/* New Progress Screen Route */}
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/badges" element={<BadgesPage />} /> {/* Badge Vault, linked from Progress/Profile */}
            <Route path="/profile" element={<ProfilePage />} /> {/* Settings Page Route */}
          </Routes>
        </main>
        <BottomNavigationBar items={navItems} />
      </div>
    </HashRouter>
  );
};

export default App;