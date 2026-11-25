import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Clock,
  Boxes,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'loan',
    title: 'Hardware Return Deadline Alert',
    description: 'Heavy Duty 4-Way Extension Cord (BIAS-EXT-002) is due for lab audit on Nov 27, 2026.',
    time: '2 hours ago',
    unread: true,
    link: '/profile',
    badge: 'Hardware Loan',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800'
  },
  {
    id: 'notif-2',
    type: 'event',
    title: 'TechnoHacks 2026 Hackathon Registration Open',
    description: 'Teams of up to 4 can now register for the 36-hour flagship hackathon at BIAS Auditorium.',
    time: '1 day ago',
    unread: true,
    link: '/events',
    badge: 'Flagship Event',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800'
  },
  {
    id: 'notif-3',
    type: 'circular',
    title: 'Hardware Lab Winter Timings Update',
    description: 'The society lab is open daily from 09:00 AM to 08:00 PM for hardware checkouts & testing.',
    time: '3 days ago',
    unread: false,
    link: '/announcements',
    badge: 'Lab Notice',
    badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-800'
  }
];

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = items.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-white transition-colors"
        title="Campus Notifications & Alerts"
        aria-label="Campus Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 glow-cyan animate-pulse"></span>
        )}
      </button>

      {/* Floating Notification Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-brand-border">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Campus Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-brand-blue/30 text-brand-cyan border border-brand-cyan/30">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-brand-cyan hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List of Alerts */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className={`block p-3 rounded-xl border transition-all ${
                  item.unread
                    ? 'bg-brand-bg/90 border-brand-cyan/30 hover:border-brand-cyan/60'
                    : 'bg-brand-bg/50 border-brand-border hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-brand-cyan mt-1 flex-shrink-0"></span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-brand-border flex items-center justify-between text-[11px]">
            <Link
              to="/announcements"
              onClick={() => setIsOpen(false)}
              className="text-brand-cyan hover:underline font-semibold flex items-center space-x-1"
            >
              <span>View All Circulars</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[10px] text-slate-500 font-mono">BIAS Central Broadcast</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
