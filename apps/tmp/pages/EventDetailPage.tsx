import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS, PASTEL_COLORS } from '../constants';
import { Event as EventType } from '../types';
import EventHeader from '../components/eventDetail/EventHeader';
import EventUnlockSection from '../components/eventDetail/EventUnlockSection';
import BrandActivationCard from '../components/eventDetail/BrandActivationCard';
import ShopCard from '../components/eventDetail/ShopCard';
import { TicketIcon } from '../components/icons/NavIcons'; // Placeholder

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [userUnlockedEvent, setUserUnlockedEvent] = useState(false); // Local state for dynamic unlock

  useEffect(() => {
    const foundEvent = MOCK_EVENTS.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      setUserUnlockedEvent(foundEvent.isUnlockedByUser || false);
    }
    // Add a small delay for section animations
    const timer = setTimeout(() => {
      document.querySelectorAll('.animated-section-event').forEach(el => {
        el.classList.remove('opacity-0', 'translate-y-5');
        el.classList.add('opacity-100', 'translate-y-0');
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [eventId]);

  const handleUnlockSuccess = () => {
    setUserUnlockedEvent(true);
    // Potentially update MOCK_EVENTS or a global state if persistence across navigation is needed
    // For this demo, local state update is sufficient for the current view.
    if (event) {
      // This only updates the local copy of event for immediate UI reflection if needed
      // MOCK_EVENTS itself is not modified here to keep it as a static source.
      setEvent(prevEvent => prevEvent ? {...prevEvent, isUnlockedByUser: true} : null);
    }
  };
  
  if (!event) {
    return (
      <div className="p-4 text-center min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <TicketIcon className="w-16 h-16 text-slate-400 mb-4" />
        <h1 className="text-xl font-semibold text-slate-700">Event not found</h1>
        <p className={`${PASTEL_COLORS.textLight} mb-6`}>The event you are looking for does not exist or has been moved.</p>
        <Link to="/events" className={`${PASTEL_COLORS.mint.button} text-white py-2 px-4 rounded-lg`}>
          Back to Events
        </Link>
      </div>
    );
  }
  
  // Use the dynamic userUnlockedEvent for the EventUnlockSection and other UI elements
  const currentEventState = { ...event, isUnlockedByUser: userUnlockedEvent };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <EventHeader event={currentEventState} />
      
      <div className="p-4 space-y-6">
        {/* Event Access/Unlock Section */}
        <section className="animated-section-event opacity-0 translate-y-5 transition-all duration-500 ease-out">
          <EventUnlockSection event={currentEventState} onUnlockSuccess={handleUnlockSuccess} />
        </section>

        {/* Event Map (Abstract Placeholder) */}
        {currentEventState.mapImageUrl && (
          <section className="animated-section-event opacity-0 translate-y-5 transition-all duration-500 ease-out delay-100">
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">Venue Map</h2>
              <img 
                src={currentEventState.mapImageUrl} 
                alt={`${currentEventState.name} map`} 
                className="w-full h-48 object-cover rounded-xl ${PASTEL_COLORS.sky.light}" 
              />
               <p className={`text-xs ${PASTEL_COLORS.textLight} mt-2 text-center`}>Abstract representation of venue zones and key points.</p>
            </div>
          </section>
        )}

        {/* Brand Activations Section */}
        {currentEventState.brandActivations && currentEventState.brandActivations.length > 0 && (
          <section className="animated-section-event opacity-0 translate-y-5 transition-all duration-500 ease-out delay-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-3 px-1">Brand Activations</h2>
            <div className="flex overflow-x-auto space-x-0 pb-2 scrollbar-hide px-1"> {/* Adjusted space-x for card margins */}
              {currentEventState.brandActivations.map(activation => (
                <BrandActivationCard key={activation.id} activation={activation} />
              ))}
            </div>
          </section>
        )}

        {/* Shops & Vendors Section */}
        {currentEventState.shops && currentEventState.shops.length > 0 && (
          <section className="animated-section-event opacity-0 translate-y-5 transition-all duration-500 ease-out delay-300">
            <h2 className="text-xl font-semibold text-slate-700 mb-3 px-1">Shops & Vendors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentEventState.shops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        {/* Event FAQ Link */}
        {currentEventState.faqLink && (
          <section className="text-center py-6 animated-section-event opacity-0 translate-y-5 transition-all duration-500 ease-out delay-400">
            <a 
              href={currentEventState.faqLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm ${PASTEL_COLORS.lavender.text} font-medium hover:underline hover:text-purple-700`}
            >
              Event FAQ
            </a>
          </section>
        )}
      </div>
      <style>{`
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default EventDetailPage;
