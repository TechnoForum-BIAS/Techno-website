import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EventCard from '../features/group1_events/EventCard';
import EventRegistrationModal from '../features/group1_events/EventRegistrationModal';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    // Fetch events from API or fallback mock
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) setEvents(data.events);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default events
        setEvents([
          {
            id: 'evt-001',
            title: 'TechnoHacks 2026: Flagship Hackathon',
            category: 'Hackathon',
            date: '2026-12-15',
            time: '10:00 AM - 10:00 PM',
            venue: 'BIAS Auditorium & Lab Complex',
            description: '36-hour non-stop innovation sprint solving real campus and societal challenges with cutting-edge tech.',
            maxParticipants: 120,
            status: 'upcoming'
          },
          {
            id: 'evt-002',
            title: 'RoboQuest: Autonomous Line Follower',
            category: 'Robotics',
            date: '2026-12-20',
            time: '02:00 PM - 06:00 PM',
            venue: 'BIAS Quadrangle',
            description: 'Design and build your own autonomous bots to conquer the obstacle course. Hardware kits provided by Technoforum.',
            maxParticipants: 60,
            status: 'upcoming'
          },
          {
            id: 'evt-003',
            title: 'Web3 & AI Fusion Workshop',
            category: 'Workshop',
            date: '2026-11-28',
            time: '04:00 PM - 07:00 PM',
            venue: 'Virtual / Lab 3',
            description: 'Hands-on masterclass on building decentralized applications paired with LLM agents.',
            maxParticipants: 80,
            status: 'ongoing'
          }
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Hackathon', 'Robotics', 'Workshop', 'Technical'];

  const filteredEvents = events.filter(evt => {
    const matchesCat = selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Technoforum Events</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover upcoming hackathons, tech workshops, and robotics competitions at BIAS Bhimtal.
          </p>
        </div>
        {(user?.role === 'coordinator' || user?.role === 'admin') && (
          <button className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold glow-blue">
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-sm glow-blue'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300 border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-brand-muted text-sm font-mono">Loading events catalog...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border text-slate-400 text-sm">
          No events found for this filter. Check back soon for new announcements!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={(evt) => setActiveModalEvent(evt)}
            />
          ))}
        </div>
      )}

      {/* Event Participation Registration Modal */}
      <EventRegistrationModal
        event={activeModalEvent}
        isOpen={Boolean(activeModalEvent)}
        onClose={() => setActiveModalEvent(null)}
        user={user}
      />

    </div>
  );
};

export default EventsPage;
