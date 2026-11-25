import React, { useState, useEffect } from 'react';
import {
  Bell,
  Pin,
  Calendar,
  Clock,
  User,
  FileText,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  ExternalLink,
  Users,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoticeModal from '../components/NoticeModal';

const CATEGORY_FILTERS = [
  'All',
  'Academic Circular',
  'Hackathon & Competition',
  'Hardware Lab & Equipment',
  'Society Recruitment',
  'Urgent / Campus Alert'
];

const AnnouncementsPage = () => {
  const { user, token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const canManageNotices = user?.role === 'coordinator' || user?.role === 'admin';

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) setAnnouncements(data.announcements);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateNew = () => {
    setSelectedNotice(null);
    setModalOpen(true);
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete notice "${title}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.message || 'Failed to delete announcement.');
      }
    } catch {
      alert('Error connecting to server to delete announcement.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleNoticeSaved = (savedNotice) => {
    setAnnouncements((prev) => {
      const exists = prev.some((a) => a.id === savedNotice.id);
      if (exists) {
        return prev.map((a) => (a.id === savedNotice.id ? savedNotice : a));
      }
      return [savedNotice, ...prev];
    });
  };

  // Filter and search
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCategory =
      activeCategory === 'All' ||
      ann.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      ann.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-card via-[#0F1934] to-brand-card border border-brand-border p-6 sm:p-8 glow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-cyan text-xs font-semibold tracking-wide border border-brand-cyan/30">
              <Bell className="w-3.5 h-3.5" />
              <span>Birla Institute of Applied Sciences • Official Circular Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Campus Notices & Announcements
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official circulars, laboratory rules, hackathon schedules, and recruitment updates issued by the Technoforum core committee and faculty.
            </p>
          </div>

          {/* Create Button (Coordinators & Admins Only) */}
          {canManageNotices && (
            <button
              onClick={handleCreateNew}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white text-xs font-bold shadow-lg glow-blue flex items-center space-x-2 transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Official Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar: Search & Category Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by keyword, title, author..."
              className="w-full pl-10 pr-4 py-2 bg-brand-card border border-brand-border rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Count Badge */}
          <div className="text-xs font-mono text-slate-400 self-end sm:self-auto">
            Showing <strong className="text-brand-cyan">{filteredAnnouncements.length}</strong> of {announcements.length} circulars
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-blue text-white shadow-sm glow-blue'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300 border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-mono">Loading official campus announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl bg-brand-card border border-brand-border p-12 text-center space-y-3 glow-card">
            <Bell className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Circulars Match Your Filter</h3>
            <p className="text-xs text-slate-400">
              Try switching category pills or clearing your search keywords.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`rounded-2xl bg-brand-card border transition-all glow-card p-6 sm:p-7 space-y-4 relative ${
                ann.isPinned
                  ? 'border-brand-cyan/50 bg-gradient-to-br from-brand-card via-[#0F1B36] to-brand-card'
                  : 'border-brand-border hover:border-slate-700'
              }`}
            >
              {/* Header Badges & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Pinned Pill */}
                  {ann.isPinned && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700 text-brand-cyan text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Pin className="w-3 h-3" />
                      <span>PINNED CIRCULAR</span>
                    </span>
                  )}

                  {/* Priority Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      ann.priority === 'Urgent'
                        ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                        : ann.priority === 'High'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                        : 'bg-blue-950/70 text-blue-300 border-blue-800'
                    }`}
                  >
                    {ann.priority || 'NORMAL'}
                  </span>

                  {/* Category */}
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-cardHover border border-brand-border text-slate-300 text-[11px] font-semibold">
                    {ann.category}
                  </span>
                </div>

                {/* Coordinator / Admin Management Actions (Edit / Delete) */}
                {canManageNotices && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(ann)}
                      className="px-2.5 py-1 rounded-lg bg-brand-bg hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-brand-cyan text-xs font-semibold flex items-center space-x-1 transition-colors"
                      title="Edit this announcement"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(ann.id, ann.title)}
                      disabled={deleteLoading === ann.id}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50"
                      title="Delete this announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deleteLoading === ann.id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{ann.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              {/* Meta Info Bar: Date, Time, Author, Audience */}
              <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{ann.date}</span>
                    {ann.time && <span className="text-slate-500">• {ann.time}</span>}
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <User className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{ann.author}</span>
                  </div>

                  {ann.targetAudience && (
                    <div className="flex items-center space-x-1.5 text-purple-300">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ann.targetAudience}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: ann.title, text: ann.content, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(`${ann.title}\n${window.location.href}`);
                        alert('Notice link copied to clipboard!');
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-brand-bg text-slate-400 hover:text-white transition-colors"
                    title="Share notice"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Creating or Editing Notices */}
      <NoticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleNoticeSaved}
        initialNotice={selectedNotice}
      />

    </div>
  );
};

export default AnnouncementsPage;
