import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { PASTEL_COLORS } from '../constants';

interface BottomNavigationBarProps {
  items: NavItem[];
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ items }) => {
  const location = useLocation();
  const [isScanAnimating, setIsScanAnimating] = React.useState(false);

  React.useEffect(() => {
    setIsScanAnimating(true);
    const timer = setTimeout(() => setIsScanAnimating(false), 700); 
    return () => clearTimeout(timer);
  }, []);


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-t-custom border-t border-slate-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const IconComponent = isActive && item.activeIcon ? item.activeIcon : item.icon;
          
          let iconColorClass = 'text-slate-500';
          if (isActive) {
            if (item.id === 'home') iconColorClass = PASTEL_COLORS.lavender.filled_icon;
            else if (item.id === 'progress') iconColorClass = PASTEL_COLORS.blush.filled_icon; // Highlight color for Progress (Trophy)
            else if (item.id === 'wallet') iconColorClass = PASTEL_COLORS.yellow.filled_icon;
            // else if (item.id === 'events') iconColorClass = PASTEL_COLORS.mint.filled_icon; // Events removed as top-level nav for this specific request
            // else if (item.id === 'badges') iconColorClass = PASTEL_COLORS.blush.filled_icon; // Badges part of progress/profile
            else if (item.id === 'profile') iconColorClass = PASTEL_COLORS.sky.filled_icon; // Profile (Settings)
          }


          if (item.isSpecial) {
            return (
              <Link
                to={item.path}
                key={item.id}
                className={`relative -top-6 ${PASTEL_COLORS.mint.DEFAULT} text-white rounded-full p-4 shadow-lg transition-all duration-500 ease-out hover:scale-110 active:scale-95 transform ${isScanAnimating ? 'scale-110 opacity-100' : 'scale-100 opacity-100'}`}
                style={{ animation: isScanAnimating ? 'bounceIn 0.7s ease-out' : 'none' }}
                aria-label={item.label}
              >
                <IconComponent className="w-7 h-7" />
                <span className="sr-only">{item.label}</span> 
              </Link>
            );
          }
          
          return (
            <Link
              to={item.path}
              key={item.id}
              className={`flex flex-col items-center justify-center p-2 rounded-lg space-y-1 transition-all duration-200 ease-in-out transform group hover:bg-slate-100 active:scale-90 
                ${iconColorClass}`}
              aria-label={item.label}
            >
              <IconComponent className={`w-6 h-6 transition-colors ${isActive ? '' : 'group-hover:text-slate-700'}`} />
              <span className="sr-only"> 
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.5) translateY(10px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-5px); opacity: 1; }
          80% { transform: scale(0.95) translateY(0px); }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .shadow-t-custom {
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -2px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </nav>
  );
};

export default BottomNavigationBar;