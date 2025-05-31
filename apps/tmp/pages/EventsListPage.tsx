import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS, PASTEL_COLORS } from '../constants';
import { Event } from '../types';
import { TicketIcon } from '../components/icons/NavIcons'; // Example icon, can be adapted

const EventListItemCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Link 
      to={`/events/${event.id}`} 
      className="block bg-white p-5 rounded-2xl shadow-lg mb-4 transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
      aria-label={`View details for ${event.name}`}
    >
      <div className="flex items-start space-x-4">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.name} className="w-24 h-24 rounded-xl object-cover" />
        ) : (
          <div className={`w-24 h-24 ${event.abstractColor} rounded-xl flex items-center justify-center`}>
            <TicketIcon className="w-10 h-10 text-slate-500" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">{event.name}</h3>
          <p className="text-sm text-slate-500 mb-1">{event.dates} &bull; {event.location}</p>
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full text-white
              ${event.isUnlockedByUser ? PASTEL_COLORS.mint.button : PASTEL_COLORS.lavender.button}`}
          >
            {event.isUnlockedByUser ? 'Unlocked' : 'Locked'}
          </span>
        </div>
      </div>
    </Link>
  );
};

const EventsListPage: React.FC = () => {
  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Events</h1>
        <p className={`${PASTEL_COLORS.textLight}`}>Discover upcoming festivals and experiences.</p>
      </header>
      
      {MOCK_EVENTS.length > 0 ? (
        MOCK_EVENTS.map(event => (
          <EventListItemCard key={event.id} event={event} />
        ))
      ) : (
        <p className={`${PASTEL_COLORS.textDark} text-center py-10`}>No events available at the moment.</p>
      )}
    </div>
  );
};

export default EventsListPage;
