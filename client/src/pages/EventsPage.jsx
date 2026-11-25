import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, Plus, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Registration Modal State
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [regForm, setRegForm] = useState({
    studentName: user ? user.name : '',
    rollNumber: user ? user.rollNumber : '',
    email: user ? user.email : '',
    phone: '',
    teamMembers: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: activeModalEvent.id,
        ...regForm
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitted(true);
      });
  };

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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
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
        <div className="text-center py-20 text-brand-muted text-sm font-mono">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border text-slate-400 text-sm">
          No events found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-cyan/40 transition-all flex flex-col justify-between overflow-hidden glow-card group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-brand-blue/20 text-brand-cyan text-[11px] font-semibold border border-brand-cyan/20">
                    {evt.category}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${evt.status === 'upcoming' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400'
                    }`}>
                    {evt.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-slate-300 font-mono">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-cardHover border-t border-brand-border flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-brand-muted">
                  <Users className="w-3.5 h-3.5" />
                  <span>Max: {evt.maxParticipants} seats</span>
                </div>
                <button
                  onClick={() => {
                    setActiveModalEvent(evt);
                    setSubmitted(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold transition-colors glow-blue"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-2xl max-w-lg w-full p-6 space-y-6 glow-card relative">
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Registration Confirmed!</h3>
                <p className="text-xs text-slate-300">
                  You are registered for <strong className="text-brand-cyan">{activeModalEvent.title}</strong>. Check your college email for details.
                </p>
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="px-5 py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-brand-cyan uppercase">Participation Entry Form</span>
                  <h3 className="text-lg font-bold text-white">{activeModalEvent.title}</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Student Full Name</label>
                    <input
                      type="text"
                      required
                      value={regForm.studentName}
                      onChange={e => setRegForm({ ...regForm, studentName: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">University Roll Number</label>
                      <input
                        type="text"
                        required
                        value={regForm.rollNumber}
                        onChange={e => setRegForm({ ...regForm, rollNumber: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">College / Personal Email</label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="text"
                      placeholder="+91 XXXXXXXXXX"
                      value={regForm.phone}
                      onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Team Members (if applicable)</label>
                    <textarea
                      placeholder="e.g. Rahul (230105), Sneha (230112)"
                      rows={2}
                      value={regForm.teamMembers}
                      onChange={e => setRegForm({ ...regForm, teamMembers: e.target.value })}
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalEvent(null)}
                    className="px-4 py-2 bg-brand-cardHover border border-brand-border text-slate-300 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-semibold glow-blue"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsPage;
