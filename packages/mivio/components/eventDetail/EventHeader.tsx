import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, InformationCircleIcon, MapPinIcon } from '../icons/NavIcons';
import { Event } from '../../types';
import { PASTEL_COLORS } from '../../constants';

interface EventHeaderProps {
  event: Event;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <header className="p-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className={`p-2 rounded-full hover:${PASTEL_COLORS.mint.light} active:bg-green-200 transition-colors`}
          aria-label="Go back"
        >
          <ChevronLeftIcon className={`w-6 h-6 ${PASTEL_COLORS.mint.text}`} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-slate-800 truncate">{event.name}</h1>
          <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
            <MapPinIcon className="w-3 h-3 inline-block" />
            <span>{event.location} &bull; {event.dates}</span>
          </div>
        </div>
        <button 
          className={`p-2 rounded-full hover:${PASTEL_COLORS.lavender.light} active:bg-purple-200 transition-colors`}
          aria-label="Event information"
        >
          <InformationCircleIcon className={`w-6 h-6 ${PASTEL_COLORS.lavender.text}`} />
        </button>
      </div>
    </header>
  );
};

export default EventHeader;