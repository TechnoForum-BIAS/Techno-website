import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Boxes,
  Award,
  Bell,
  ArrowRight,
  Sparkles,
  X,
  ExternalLink,
  Shield,
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

const SEARCH_ITEMS = [
  // Navigation & Core Pages
  {
    id: 'nav-events',
    type: 'Page',
    title: 'Events & Hackathons Portal',
    subtitle: 'Browse upcoming college hackathons, robotics challenges & workshops',
    path: '/events',
    icon: Calendar,
    category: 'Navigation'
  },
  {
    id: 'nav-inventory',
    type: 'Page',
    title: 'Hardware Lab & Equipment Catalog',
    subtitle: 'Browse 180+ laboratory components, sensors & tools',
    path: '/inventory',
    icon: Boxes,
    category: 'Navigation'
  },
  {
    id: 'nav-verify',
    type: 'Tool',
    title: 'Verify Certificate Credential',
    subtitle: 'Instant public cryptographic verification by Roll Number or ID',
    path: '/certificates/verify',
    icon: Award,
    category: 'Navigation'
  },
  {
    id: 'nav-notices',
    type: 'Page',
    title: 'Announcements & Society Circulars',
    subtitle: 'Official notices, lab rules, flyer circulars & schedules',
    path: '/announcements',
    icon: Bell,
    category: 'Navigation'
  },
  {
    id: 'nav-cert-studio',
    type: 'Tool',
    title: 'Certificate Studio (Batch Generator)',
    subtitle: 'Upload template, CSV roster & generate vector PDFs with QR codes',
    path: '/certificates/studio',
    icon: Award,
    category: 'Tools'
  },
  {
    id: 'nav-admin-users',
    type: 'Admin',
    title: 'Manage Users & Roles Dashboard',
    subtitle: 'Search registered students, inspect sign-in logs & assign roles',
    path: '/admin/users',
    icon: Shield,
    category: 'Admin Console'
  },

  // Events & Competitions
  {
    id: 'evt-1',
    type: 'Event',
    title: 'TechnoHacks 2026: Annual Flagship Hackathon',
    subtitle: '36-hour innovation sprint • BIAS Auditorium & Labs • Dec 15',
    path: '/events',
    icon: Calendar,
    category: 'Events'
  },
  {
    id: 'evt-2',
    type: 'Event',
    title: 'RoboQuest: Autonomous Line Follower Challenge',
    subtitle: 'Robotics competition • Hardware kits provided • Dec 20',
    path: '/events',
    icon: Calendar,
    category: 'Events'
  },
  {
    id: 'evt-3',
    type: 'Event',
    title: 'Web3 & AI Fusion Workshop',
    subtitle: 'Decentralized apps & LLM agent masterclass • Nov 28',
    path: '/events',
    icon: Calendar,
    category: 'Events'
  },

  // Hardware Items
  {
    id: 'inv-1',
    type: 'Hardware',
    title: 'Arduino Uno R3 Microcontroller',
    subtitle: '18 Available • Serial prefix: BIAS-ARD • Checkout enabled',
    path: '/inventory',
    icon: Boxes,
    category: 'Hardware'
  },
  {
    id: 'inv-2',
    type: 'Hardware',
    title: 'Heavy Duty 4-Way Extension Cord (10m)',
    subtitle: '6 Available • Tracked serial: BIAS-EXT-001 to 004',
    path: '/inventory',
    icon: Boxes,
    category: 'Hardware'
  },
  {
    id: 'inv-3',
    type: 'Hardware',
    title: 'HC-SR04 Ultrasonic Distance Sensor',
    subtitle: '35 Available • 5V sonar sensor for obstacle avoidance',
    path: '/inventory',
    icon: Boxes,
    category: 'Hardware'
  },
  {
    id: 'inv-4',
    type: 'Hardware',
    title: 'Soldering Iron Station 60W Kit',
    subtitle: 'Lab tool • Temperature controlled with brass tip cleaner',
    path: '/inventory',
    icon: Boxes,
    category: 'Hardware'
  }
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on query
  const filtered = query.trim() === ''
    ? SEARCH_ITEMS.slice(0, 7)
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      } else if (query.trim()) {
        // Direct certificate query fallback
        navigate(`/certificates/verify?query=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-brand-border bg-brand-bg/80">
          <Search className="w-5 h-5 text-brand-cyan mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search events, hardware components, circulars, roll number (e.g. 230101)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-brand-card border border-brand-border text-slate-400">
            ESC to close
          </span>
        </div>

        {/* Dynamic Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-brand-border/40">
          {filtered.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                No matching results found for "<span className="text-white font-mono">{query}</span>"
              </div>
              <button
                onClick={() => {
                  navigate(`/certificates/verify?query=${encodeURIComponent(query.trim())}`);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-blue-600 inline-flex items-center space-x-1.5"
              >
                <span>Look up in Certificate Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-blue/25 text-white border border-brand-cyan/40 shadow-sm'
                      : 'text-slate-300 hover:bg-brand-bg/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.type === 'Admin'
                          ? 'bg-purple-950/70 text-purple-300 border border-purple-800'
                          : item.type === 'Hardware'
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800'
                          : item.type === 'Event'
                          ? 'bg-blue-950/70 text-blue-300 border border-blue-800'
                          : 'bg-brand-card text-brand-cyan border border-brand-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold uppercase bg-brand-card border border-brand-border text-brand-cyan">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 flex-shrink-0 ml-3 transition-transform ${
                      isSelected ? 'text-brand-cyan translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 py-2.5 bg-brand-bg border-t border-brand-border flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-brand-cyan">Technoforum Search Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
