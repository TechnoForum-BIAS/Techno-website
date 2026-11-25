import React, { useState, useEffect } from 'react';
import { Bell, Pin, Download, Calendar, User, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.announcements) setAnnouncements(data.announcements);
        setLoading(false);
      })
      .catch(() => {
        setAnnouncements([
          {
            id: 'ann-001',
            title: 'Recruitment Drive 2026: Technoforum Core Team',
            category: 'Society Recruitment',
            date: '2026-11-22',
            author: 'President, Technoforum',
            content: 'Calling all coders, designers, hardware hackers, and organizers! Technoforum core committee recruitments for 2026 are officially open. Fill out the application form before November 30.',
            flyerUrl: '/assets/announcements/recruitment-2026.png',
            isPinned: true
          },
          {
            id: 'ann-002',
            title: 'Hardware Lab Inventory Auditing Guidelines',
            category: 'Inventory Notice',
            date: '2026-11-18',
            author: 'Hardware Coordinator',
            content: 'All students with active component issues must submit their equipment (especially extension cords and Arduino kits) for physical serial verification before the semester break.',
            flyerUrl: '/assets/announcements/lab-notice.png',
            isPinned: false
          },
          {
            id: 'ann-003',
            title: 'BIAS Annual TechFest "Technovation" Dates Announced',
            category: 'College Fest',
            date: '2026-11-12',
            author: 'Faculty Coordinator',
            content: 'Get ready for three days of non-stop robotics, hackathons, and esports battles taking place February 2027.',
            flyerUrl: '/assets/announcements/techfest.png',
            isPinned: false
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notices & Circular Flyers</h1>
          <p className="text-sm text-slate-400 mt-1">
            Official announcements, event circulars, and recruitment updates from Technoforum BIAS.
          </p>
        </div>

        {(user?.role === 'coordinator' || user?.role === 'admin') && (
          <button className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-semibold glow-blue">
            + Post Announcement
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl bg-brand-card border ${ann.isPinned ? 'border-brand-cyan/40 bg-brand-card/90' : 'border-brand-border'
              } p-6 sm:p-8 glow-card space-y-4 relative overflow-hidden`}
          >
            {ann.isPinned && (
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[11px] font-semibold">
                <Pin className="w-3.5 h-3.5" />
                <span>Pinned Notice</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-white">{ann.title}</h3>
              <span className="text-xs text-brand-muted font-mono">{ann.category}</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>

            <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-muted">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{ann.author}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{ann.date}</span>
                </div>
              </div>

              {/* Flyer download simulation */}
              <button
                onClick={() => alert(`Downloading circular flyer for ${ann.title}`)}
                className="inline-flex items-center space-x-1.5 text-brand-cyan hover:underline text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Attached Flyer (PDF/PNG)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AnnouncementsPage;
