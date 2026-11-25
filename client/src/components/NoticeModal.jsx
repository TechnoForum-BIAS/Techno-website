import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Pin,
  AlertTriangle,
  FileText,
  Users,
  Image,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Academic Circular',
  'Hackathon & Competition',
  'Hardware Lab & Equipment',
  'Society Recruitment',
  'General Notice',
  'Urgent / Campus Alert'
];

const AUDIENCES = [
  'All Students & Faculty',
  '1st & 2nd Year Students',
  '3rd & 4th Year Students',
  'Hardware Lab Members',
  'Hackathon Participants'
];

const NoticeModal = ({ isOpen, onClose, onSaved, initialNotice = null }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'General Notice',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    content: '',
    isPinned: false,
    flyerUrl: '/assets/announcements/lab-notice.png',
    targetAudience: 'All Students & Faculty'
  });

  useEffect(() => {
    if (initialNotice) {
      setFormData({
        title: initialNotice.title || '',
        category: initialNotice.category || 'General Notice',
        priority: initialNotice.priority || 'Normal',
        date: initialNotice.date || new Date().toISOString().split('T')[0],
        time: initialNotice.time || '10:00',
        content: initialNotice.content || '',
        isPinned: Boolean(initialNotice.isPinned),
        flyerUrl: initialNotice.flyerUrl || '/assets/announcements/lab-notice.png',
        targetAudience: initialNotice.targetAudience || 'All Students & Faculty'
      });
    } else {
      setFormData({
        title: '',
        category: 'General Notice',
        priority: 'Normal',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        content: '',
        isPinned: false,
        flyerUrl: '/assets/announcements/lab-notice.png',
        targetAudience: 'All Students & Faculty'
      });
    }
    setError('');
  }, [initialNotice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isEdit = Boolean(initialNotice?.id);
    const url = isEdit ? `/api/announcements/${initialNotice.id}` : '/api/announcements';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save announcement');
      }

      onSaved(data.announcement || { ...formData, id: initialNotice?.id || `ann-${Date.now()}` });
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while publishing notice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="bg-brand-card border border-brand-border rounded-2xl max-w-2xl w-full p-6 space-y-5 glow-card relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-brand-bg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30 uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{initialNotice ? 'Edit Society Notice' : 'Create Official Notice'}</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {initialNotice ? 'Update Announcement' : 'Publish New Campus Circular'}
          </h2>
          <p className="text-xs text-slate-400">
            Broadcasting as: <strong className="text-white">{user?.name}</strong> ({user?.role?.toUpperCase()})
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notice Title <span className="text-brand-cyan">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hardware Lab Inventory Auditing & Return Guidelines"
              className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Type of Announcement <span className="text-brand-cyan">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Notice Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              >
                <option value="Normal">Normal (Standard Bulletin)</option>
                <option value="High">High (Important Notice)</option>
                <option value="Urgent">Urgent (Immediate Campus Action)</option>
              </select>
            </div>
          </div>

          {/* Date & Time (Calendar Date Selection) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Notice Effective Date <span className="text-brand-cyan">*</span></span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-blue" />
                <span>Publish Time</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Audience</span>
            </label>
            <select
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
            >
              {AUDIENCES.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Content / Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notice Description & Instructions <span className="text-brand-cyan">*</span></span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Provide complete circular details, venue details, submission links, and guidelines for students..."
              className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan leading-relaxed"
            />
          </div>

          {/* Flyer / Attachment Image URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1.5">
              <Image className="w-3.5 h-3.5 text-amber-400" />
              <span>Flyer / Circular Image URL (Optional)</span>
            </label>
            <input
              type="text"
              value={formData.flyerUrl}
              onChange={(e) => setFormData({ ...formData, flyerUrl: e.target.value })}
              placeholder="e.g. /assets/announcements/lab-notice.png or external link"
              className="w-full bg-[#0A1224] border border-brand-border rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan text-xs"
            />
          </div>

          {/* Pin to Top Checkbox */}
          <div className="pt-2 flex items-center space-x-2.5">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 rounded text-brand-blue bg-[#0A1224] border-brand-border focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isPinned" className="text-xs text-slate-200 flex items-center space-x-1.5 cursor-pointer">
              <Pin className="w-3.5 h-3.5 text-brand-cyan" />
              <span><strong>Pin this circular to top</strong> (Show with priority glow on Homepage & Profile)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-brand-border flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-brand-bg hover:bg-brand-cardHover border border-brand-border text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white font-bold text-xs shadow-md glow-blue transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{initialNotice ? 'Save Updates' : 'Publish Notice Broadcast'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoticeModal;
