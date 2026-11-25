import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

/**
 * EventCard Component
 * Owned by: Group 1 (Intern 1 & 2)
 * Displays an individual event card with details, category pill, and registration trigger.
 */
const EventCard = ({ event, onRegister }) => {
  return (
    <div className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-blue/50 transition-all flex flex-col justify-between p-6 glow-card">
      <div className="space-y-4">
        {/* Category & Status */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-brand-blue/20 text-brand-cyan text-[11px] font-semibold">
            {event.category}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
            event.status === 'upcoming' 
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
              : 'bg-amber-950/60 text-amber-400 border border-amber-800'
          }`}>
            {event.status}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">{event.title}</h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Venue & Date Details */}
        <div className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <span>{event.date} {event.time && `• ${event.time}`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <span>Max Capacity: {event.maxParticipants || 100}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-brand-border/60 mt-6 flex items-center justify-between">
        <span className="text-[11px] text-brand-muted font-mono">Free Society Entry</span>
        <button
          onClick={() => onRegister(event)}
          className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold glow-blue transition-all"
        >
          Register Participation
        </button>
      </div>
    </div>
  );
};

export default EventCard;
